import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";
import mongoose, { Types } from "mongoose";
import { AppError } from "../../../utils/error";
import { IPaymentRepository } from "../../../repositories/interfaces/user/payment.Irepository";
import { Service } from "typedi";
import { paymentRepository } from "../../../repositories/implementations/user/payment.repository";
import { IBookingRepository } from "../../../repositories/interfaces/user/booking.Irepository";
import { bookingRepository } from "../../../repositories/implementations/user/booking.repository";
import { IHostelRepository } from "../../../repositories/interfaces/user/hostel.Irepository";
import { hostelRepository } from "../../../repositories/implementations/user/hostel.repository";
import { walletService } from "../../../services/implements/wallet/wallet.service";
import { IWalletService } from "../../interface/wallet/wallet.service.interface";
import { INotificationService } from "../../interface/notification/notification.service.interface";
import { notificationService } from "../notification/notification.service";
import socketService from "../socket/socket.service";
import { PaymentMetadata } from "../../../models/payment.model";
import { IBookingService } from "../../interface/user/booking.service.interface";
import { bookingService } from "../user/booking.service";

interface CreateCheckoutSessionParams {
  hostelId: Types.ObjectId;
  userId: Types.ObjectId;
  providerId: Types.ObjectId;
  bookingId: Types.ObjectId;
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: PaymentMetadata;
}

@Service()
export class StripeService {
  private stripe!: Stripe;
  private bookingRepo: IBookingRepository;
  private bookingService: IBookingService;
  private hostelRepo: IHostelRepository;
  private paymentRepo: IPaymentRepository;
  private walletService: IWalletService;
  private notificationService: INotificationService;

  constructor() {
    this.paymentRepo = paymentRepository;
    this.bookingRepo = bookingRepository;
    this.bookingService = bookingService;
    this.hostelRepo = hostelRepository;
    this.walletService = walletService;
    this.notificationService = notificationService;

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is missing in environment variables");
    }

    try {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
        apiVersion: "2025-03-31.basil",
      });
      console.log("Stripe initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Stripe:", error);
    }
  }

  //  For create stripe checkOut session :-

  async createCheckoutSession(
    params: CreateCheckoutSessionParams
  ): Promise<string> {
    try {
      if (!this.stripe) {
        throw new AppError(
          "Stripe is not initialized. Please check your environment variables.",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: params.currency,
              product_data: {
                name: "Hostel Booking",
                description: "Payment for hostel booking",
              },
              unit_amount: Math.round(params.amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: {
          hostelId: params.hostelId.toString(),
          userId: params.userId.toString(),
          providerId: params.providerId.toString(),
          bookingId: params.bookingId.toString(),
          ...params.metadata,
        },
      });

      // Payment Creation Section :-

      await this.paymentRepo.create({
        userId: params.userId,
        hostelId: params.hostelId,
        providerId: params.providerId,
        bookingId: params.bookingId,
        amount: params.amount,
        currency: params.currency,
        status: "pending",
        paymentMethod: "card",
        stripeSessionId: session.id,
        metadata: session.metadata || {},
      });

      return session.url!;
    } catch (error) {
      console.error("Stripe checkout session creation error:", error);
      throw new AppError(
        "Failed to create payment session: " +
          (error instanceof Error ? error.message : "Unknown error"),
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For validate the stripe webHook signature :-

  async validateWebhookSignature(
    payload: string,
    signature: string
  ): Promise<boolean> {
    try {
      this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  //  For handle Webhook :-

  async handleWebhookEvent(payload: string, signature: string): Promise<void> {
    try {
      const event: Stripe.Event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const payment = await this.paymentRepo.findByStripeSessionId(
            session.id
          );
          if (!payment)
            throw new AppError(
              "Payment record not found",
              StatusCodes.NOT_FOUND
            );

          // Check if this is a facility payment
          if (
            session.metadata?.type === "facility" &&
            session.metadata.facilities
          ) {
            // Parse facilities from metadata
            const facilities = JSON.parse(session.metadata.facilities);

            // Add facilities to booking
            await this.bookingService.addFacilitiesToBooking(
              payment.bookingId.toString(),
              String(payment.userId),
              facilities
            );
          } else {
            const amount = session.amount_total! / 100;

            const userbooking = await this.bookingRepo.getBookingById(
              payment.bookingId.toString()
            );

            if (!userbooking) {
              throw new AppError("Booking not found", StatusCodes.NOT_FOUND);
            }

            const isExpired = userbooking.paymentStatus == "expired";

            if (isExpired) {
              console.warn("Payment received for expired booking. Skipping...");
              break;
            }

            const bookingData = await this.bookingRepo.updatePaymentStatus(
              payment.bookingId.toString(),
              "completed"
            );

            // Create and emit real-time notification for the provider
            if (bookingData) {
              const hostel = await this.hostelRepo.getHostelById(
                String(bookingData.hostelId)
              );

              // Create notification in database
              const notification =
                await this.notificationService.createNotification({
                  recipient: new mongoose.Types.ObjectId(
                    String(bookingData?.providerId)
                  ),
                  sender: new mongoose.Types.ObjectId(
                    String(bookingData?.userId)
                  ),
                  title: "New Booking Request",
                  message: `You have received a new booking request for ${hostel?.hostel_name}`,
                  type: "booking",
                });

              // Emit real-time notification
              socketService.emitNotification(String(bookingData?.providerId), {
                ...notification,
                recipient: notification.recipient.toString(),
              });
            }

            // Update Hostel Available Space Status
            await this.hostelRepo.updateHostelAvailableSpace(
              payment.hostelId.toString()
            );

            // Update Payment Status
            await this.paymentRepo.updateStatus(payment._id, "completed");

            // Get booking details for amount distribution
            const booking = await this.bookingRepo.getBookingById(
              payment.bookingId.toString()
            );
            if (!booking) {
              throw new AppError("Booking not found", StatusCodes.NOT_FOUND);
            }

            // Distribute the booking amount
            try {
              await this.walletService.distributeBookingAmount(
                payment.bookingId.toString(),
                payment.providerId.toString(),
                booking.firstMonthRent || amount
              );
            } catch (error) {
              console.error("Error distributing booking amount:", error);
            }
          }

          break;
        }

        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const payment = await this.paymentRepo.findByStripeSessionId(
            paymentIntent.id
          );

          if (payment) {
            await this.paymentRepo.updateStatus(payment._id, "failed");
          }
          break;
        }
      }
    } catch (error) {
      console.error("Webhook handling error:", error);
      throw new AppError(
        "Failed to process webhook event",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

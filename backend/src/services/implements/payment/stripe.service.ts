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

interface CreateCheckoutSessionParams {
  hostelId: Types.ObjectId;
  userId: Types.ObjectId;
  providerId: Types.ObjectId;
  bookingId: Types.ObjectId;
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}

@Service()
export class StripeService {
  private stripe!: Stripe;
  private bookingRepo: IBookingRepository;
  private hostelRepo: IHostelRepository;
  private paymentRepo: IPaymentRepository;
  private walletService: IWalletService;
  private notificationService: INotificationService;

  constructor() {
    this.paymentRepo = paymentRepository;
    this.bookingRepo = bookingRepository;
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

  async handleWebhookEvent(payload: any, signature: string): Promise<void> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const sessionId = new Types.ObjectId(session.metadata?.sessionId);
          const amount = session.amount_total! / 100;

          const payment = await this.paymentRepo.findByStripeSessionId(
            session.id
          );
          if (!payment) {
            throw new AppError(
              "Payment record not found",
              StatusCodes.NOT_FOUND
            );
          }

          //  Update Payment Status :-

          const bookinData = await this.bookingRepo.updatePaymentStatus(
            payment.bookingId.toString(),
            "completed"
          );

          //  Create Booking Notification :-

          if (bookinData) {
            const hostel = await this.hostelRepo.getHostelById(
              String(bookinData.hostelId)
            );

            await this.notificationService.createNotification({
              recipient: new mongoose.Types.ObjectId(
                String(bookinData?.providerId)
              ),
              sender: new mongoose.Types.ObjectId(String(bookinData?.userId)),
              title: "New Booking Request",
              message: `You have received a new booking request for ${hostel?.hostel_name}`,
              type: "hostel",
              // relatedId: booking._id
            });
          }

          //  Update Hostel Availablespace Status :-

          await this.hostelRepo.updateHostelAvailableSpace(
            payment.hostelId.toString()
          );

          //  Update Payment Status :-

          await this.paymentRepo.updateStatus(payment._id, "completed");

          // Get booking details to access the amount:-

          const booking = await this.bookingRepo.getBookingById(
            payment.bookingId.toString()
          );
          if (!booking) {
            throw new AppError("Booking not found", StatusCodes.NOT_FOUND);
          }

          // Distribute the booking amount between provider and admin (70/30 split) :-

          try {
            await this.walletService.distributeBookingAmount(
              payment.bookingId.toString(),
              payment.providerId.toString(),
              booking.firstMonthRent || amount // Use firstMonthRent if available, otherwise use the amount from Stripe
            );
          } catch (error) {
            console.error("Error distributing booking amount:", error);
          }

          break;
        }

        // case "charge.refunded": {
        //   const charge = event.data.object as Stripe.Charge;
        //   const payment = await this.paymentRepo.findByStripeSessionId(
        //     charge.payment_intent as string
        //   );

        //   if (payment) {
        //     await this.paymentRepo.updateStatus(payment._id, "refunded");
        //   }
        //   break;
        // }

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

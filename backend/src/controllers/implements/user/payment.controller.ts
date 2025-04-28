import { Request, Response } from "express";
import Container, { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { StripeService } from "../../../services/implements/payment/stripe.service";
import { IPaymentService } from "../../../services/interface/user/payment.service.interface";
import { AppError } from "../../../utils/error";
import { BookingService } from "../../../services/implements/user/booking.service";

interface PopulatedId {
  _id: Types.ObjectId;
}

@Service()
export class PaymentController {
  constructor(
    private paymentService: IPaymentService,
    private stripeService: StripeService,
    private bookingService: BookingService
  ) {}

  async createCheckoutSession(req: Request, res: Response) {
    try {
      const {
        hostelId,
        userId,
        providerId,
        bookingId,
        amount,
        currency = "USD",
        metadata,
      } = req.body;

      // Validate required fields
      if (!hostelId || !userId || !providerId || !bookingId || !amount) {
        throw new AppError(
          "Missing required payment information",
          StatusCodes.BAD_REQUEST
        );
      }

      // Create success and cancel URLs
      const successUrl = `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${process.env.CLIENT_URL}/booking/cancel`;

      const checkoutUrl = await this.stripeService.createCheckoutSession({
        hostelId: new Types.ObjectId(hostelId),
        userId: new Types.ObjectId(userId),
        providerId: new Types.ObjectId(providerId),
        bookingId: new Types.ObjectId(bookingId),
        amount,
        currency,
        successUrl,
        cancelUrl,
        metadata,
      });

      res.status(StatusCodes.OK).json({
        status: "success",
        data: {
          checkoutUrl,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error creating checkout session",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers["stripe-signature"] as string;
      if (!signature) {
        throw new AppError(
          "No stripe signature found",
          StatusCodes.BAD_REQUEST
        );
      }

      if (!this.stripeService.validateWebhookSignature(req.body, signature)) {
        throw new AppError(
          "Invalid webhook signature",
          StatusCodes.BAD_REQUEST
        );
      }
      await this.stripeService.handleWebhookEvent(req.body, signature);

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook Error:", error.message);
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Webhook processing failed",
      });
    }
  }

  async reprocessPayment(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      

      if (!bookingId) {
        throw new AppError("Booking ID is required", StatusCodes.BAD_REQUEST);
      }

      // Get booking details from the booking service
      const booking = await this.bookingService.getBookingById(bookingId);      

      if (!booking) {
        throw new AppError("Booking not found", StatusCodes.NOT_FOUND);
      }

      if (booking.paymentStatus === "completed") {
        throw new AppError(
          "Payment for this booking is already completed",
          StatusCodes.BAD_REQUEST
        );
      }

      if (booking.paymentStatus === "cancelled") {
        throw new AppError(
          "Cannot process payment for cancelled booking",
          StatusCodes.BAD_REQUEST
        );
      }

      // Create success and cancel URLs
      const successUrl = `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${process.env.CLIENT_URL}/booking/cancel`;

      const checkoutUrl = await this.stripeService.createCheckoutSession({
        hostelId: (booking.hostelId as unknown as PopulatedId)._id,
        userId: (booking.userId as unknown as PopulatedId)._id,
        providerId: (booking.providerId as unknown as PopulatedId)._id,
        bookingId: new Types.ObjectId(bookingId),
        amount: booking.firstMonthRent,
        currency: "USD",
        successUrl,
        cancelUrl,
        metadata: {
          bookingId: bookingId,
          stayDuration: booking.stayDurationInMonths,
        },
      });

      res.status(StatusCodes.OK).json({
        status: "success",
        data: {
          checkoutUrl,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Error reprocessing payment",
      });
    }
  }
}

export const paymentController = Container.get(PaymentController);

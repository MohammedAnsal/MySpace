import { Request, Response } from "express";
import Container, { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { StripeService } from "../../../services/implements/payment/stripe.service";
import { AppError } from "../../../utils/error";
import { BookingService } from "../../../services/implements/user/booking.service";
import { AuthRequset } from "../../../types/api";
import { PaymentService } from "../../../services/implements/user/payment.service";
import { HttpStatus } from "../../../enums/http.status";

interface PopulatedId {
  _id: Types.ObjectId;
}

@Service()
export class PaymentController {
  constructor(
    private stripeService: StripeService,
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) {}

  //  Create payment :-

  async createCheckoutSession(req: Request, res: Response): Promise<Response> {
    try {
      const {
        hostelId, 
        userId,
        providerId,
        bookingId,
        amount,
        currency = "INR",
        metadata,
      } = req.body;

      if (!hostelId || !userId || !providerId || !bookingId || !amount) {
        throw new AppError(
          "Missing required payment information",
          StatusCodes.BAD_REQUEST
        );
      }

      const successUrl = `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${process.env.CLIENT_URL}/booking/cancel`;

      const checkoutUrl = await this.stripeService.createCheckoutSession({
        hostelId: new Types.ObjectId(hostelId),
        userId: new Types.ObjectId(userId),
        providerId: new Types.ObjectId(providerId._id.toString()),
        bookingId: new Types.ObjectId(bookingId),
        amount,
        currency,
        successUrl,
        cancelUrl,
        metadata,
      });

      return res.status(StatusCodes.OK).json({
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

  //  Handle stripe web-hook :-

  async handleWebhook(req: Request, res: Response): Promise<Response> {
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

      return res.json({ received: true });
    } catch (error) {
      console.error("Webhook Error:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error || "Webhook processing failed",
      });
    }
  }

  //  Failed payment re-payment handle :-

  async reprocessPayment(req: Request, res: Response): Promise<Response> {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        throw new AppError("Booking ID is required", StatusCodes.BAD_REQUEST);
      }

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

      return res.status(StatusCodes.OK).json({
        status: "success",
        data: {
          checkoutUrl,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Error reprocessing payment",
      });
    }
  }

  async findByStripeSessionId(
    req: AuthRequset,
    res: Response
  ): Promise<Response> {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Session ID is required",
        });
      }

      const payment = await this.paymentService.getPaymentByStripeSessionId(
        String(sessionId)
      );

      if (!payment) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: "expired",
          message: "No payment record found",
          data: null,
        });
      }

      let booking;
      try {
        booking = await this.bookingService.getBookingById(
          payment.bookingId.toString()
        );
      } catch (error) {
        return res.status(HttpStatus.OK).json({
          status: "expired",
          message: "Booking not found or already expired",
          data: payment,
        });
      }

      if (
        !booking ||
        booking.paymentStatus === "expired" ||
        Date.now() > new Date(booking.paymentExpiry).getTime()
      ) {
        return res.status(HttpStatus.OK).json({
          status: "expired",
          message: "Booking has expired",
          data: payment,
        });
      }

      return res.status(HttpStatus.OK).json({
        status: "success",
        message: "Payment found successfully",
        data: payment,
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Error finding payment",
      });
    }
  }
}

export const paymentController = Container.get(PaymentController);

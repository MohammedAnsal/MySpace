import { Request, Response } from "express";
import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { StripeService } from "../../../services/implements/payment/stripe.service";
import { IPaymentService } from "../../../services/interface/user/payment.service.interface";
import { AppError } from "../../../utils/error";

@Service()
export class PaymentController {
  constructor(
    private paymentService: IPaymentService,
    private stripeService: StripeService
  ) {}

  async createCheckoutSession(req: Request, res: Response) {
    try {
      const {
        hostelId,
        userId,
        providerId,
        bookingId,
        amount,
        currency = "inr",
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

}

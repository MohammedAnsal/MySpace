import Container, { Service } from "typedi";
import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { IPaymentRepository } from "../../interfaces/user/payment.Irepository";
import {
  IHostelPayment,
  HostelPaymentModel,
} from "../../../models/payment.model";
import { AppError } from "../../../utils/error";

@Service()
export class PaymentRepository implements IPaymentRepository {
  //  For create payement :-

  async create(payment: Partial<IHostelPayment>): Promise<IHostelPayment> {
    try {
      const newPayment = new HostelPaymentModel(payment);
      return await newPayment.save();
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Failed to create payment record",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For find single payment :-

  async findById(id: Types.ObjectId): Promise<IHostelPayment | null> {
    try {
      return await HostelPaymentModel.findById(id);
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Failed to fetch payment",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // For find payment by hostelId :-

  async findByHostelId(
    hostelId: Types.ObjectId
  ): Promise<IHostelPayment | null> {
    try {
      return await HostelPaymentModel.findOne({ hostelId });
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Failed to fetch payment by session ID",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For update payment status :-

  async updateStatus(
    id: Types.ObjectId,
    status: string
  ): Promise<IHostelPayment | null> {
    try {
      return await HostelPaymentModel.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      );
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Failed to update payment status",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For find payment by stripe ID :-

  async findByStripeSessionId(
    stripeSessionId: string
  ): Promise<IHostelPayment | null> {
    try {
      return await HostelPaymentModel.findOne({ stripeSessionId });
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Failed to fetch payment by Stripe session ID",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const paymentRepository = Container.get(PaymentRepository);

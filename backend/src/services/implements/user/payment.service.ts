import Container, { Service } from "typedi";
import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { IPaymentService } from "../../interface/user/payment.service.interface";
import { IPaymentRepository } from "../../../repositories/interfaces/user/payment.Irepository";
import { IHostelPayment } from "../../../models/payment.model";
import { AppError } from "../../../utils/error";

@Service()
export class PaymentService implements IPaymentService {
  constructor(private paymentRepository: IPaymentRepository) {}

  async createPayment(
    paymentData: Partial<IHostelPayment>
  ): Promise<IHostelPayment> {
    try {
      // Validate required fields
      if (!paymentData.userId || !paymentData.hostelId || !paymentData.amount) {
        throw new AppError(
          "Missing required payment information",
          StatusCodes.BAD_REQUEST
        );
      }

      // Create payment record
      const payment = await this.paymentRepository.create(paymentData);

      if (!payment) {
        throw new AppError(
          "Failed to create payment record",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return payment;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error creating payment",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPaymentById(paymentId: Types.ObjectId): Promise<IHostelPayment> {
    try {
      const payment = await this.paymentRepository.findById(paymentId);

      if (!payment) {
        throw new AppError("Payment not found", StatusCodes.NOT_FOUND);
      }

      return payment;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error fetching payment",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPaymentByHostelId(
    hostelId: Types.ObjectId
  ): Promise<IHostelPayment> {
    try {
      const payment = await this.paymentRepository.findByHostelId(hostelId);

      if (!payment) {
        throw new AppError(
          "Payment not found for this session",
          StatusCodes.NOT_FOUND
        );
      }

      return payment;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error fetching payment by session",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePaymentStatus(
    paymentId: Types.ObjectId,
    status: string
  ): Promise<IHostelPayment> {
    try {
      // Validate status
      const validStatuses = ["pending", "completed", "failed", "refunded"];
      if (!validStatuses.includes(status)) {
        throw new AppError("Invalid payment status", StatusCodes.BAD_REQUEST);
      }

      const updatedPayment = await this.paymentRepository.updateStatus(
        paymentId,
        status
      );

      if (!updatedPayment) {
        throw new AppError("Payment not found", StatusCodes.NOT_FOUND);
      }

      return updatedPayment;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error updating payment status",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPaymentByStripeSessionId(
    stripeSessionId: string
  ): Promise<IHostelPayment> {
    try {
      const payment = await this.paymentRepository.findByStripeSessionId(
        stripeSessionId
      );

      if (!payment) {
        throw new AppError(
          "Payment not found for this Stripe session",
          StatusCodes.NOT_FOUND
        );
      }

      return payment;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error fetching payment by Stripe session",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const paymentService = Container.get(PaymentService)
import Container, { Service } from "typedi";
import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { IPaymentService } from "../../interface/user/payment.service.interface";
import { IPaymentRepository } from "../../../repositories/interfaces/user/payment.Irepository";
import { AppError } from "../../../utils/error";
import {
  PaymentResponseDTO,
  CreatePaymentDTO,
  UpdatePaymentStatusDTO,
  mapToPaymentDTO,
} from "../../../dtos/user/payment.dto";

@Service()
export class PaymentService implements IPaymentService {
  constructor(private paymentRepository: IPaymentRepository) {}

  //  Create payment :-

  async createPayment(
    paymentData: CreatePaymentDTO
  ): Promise<PaymentResponseDTO> {
    try {
      if (!paymentData.userId || !paymentData.hostelId || !paymentData.amount) {
        throw new AppError(
          "Missing required payment information",
          StatusCodes.BAD_REQUEST
        );
      }

      const paymentModelData = {
        ...paymentData,
        userId: new Types.ObjectId(paymentData.userId),
        hostelId: new Types.ObjectId(paymentData.hostelId),
        bookingId: new Types.ObjectId(paymentData.bookingId),
      };

      const payment = await this.paymentRepository.create(paymentModelData);

      if (!payment) {
        throw new AppError(
          "Failed to create payment record",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return mapToPaymentDTO(payment);
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

  //  Get single payment :-

  async getPaymentById(paymentId: Types.ObjectId): Promise<PaymentResponseDTO> {
    try {
      const payment = await this.paymentRepository.findById(paymentId);

      if (!payment) {
        throw new AppError("Payment not found", StatusCodes.NOT_FOUND);
      }

      return mapToPaymentDTO(payment);
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

  //  Get payment by hostelId :-

  async getPaymentByHostelId(
    hostelId: Types.ObjectId
  ): Promise<PaymentResponseDTO> {
    try {
      const payment = await this.paymentRepository.findByHostelId(hostelId);

      if (!payment) {
        throw new AppError(
          "Payment not found for this session",
          StatusCodes.NOT_FOUND
        );
      }

      return mapToPaymentDTO(payment);
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

  //  Update payment status :-

  async updatePaymentStatus(
    paymentId: Types.ObjectId,
    status: UpdatePaymentStatusDTO
  ): Promise<PaymentResponseDTO> {
    try {
      const validStatuses = ["pending", "completed", "failed", "refunded"];
      if (!validStatuses.includes(status.status)) {
        throw new AppError("Invalid payment status", StatusCodes.BAD_REQUEST);
      }

      const updatedPayment = await this.paymentRepository.updateStatus(
        paymentId,
        status.status
      );

      if (!updatedPayment) {
        throw new AppError("Payment not found", StatusCodes.NOT_FOUND);
      }

      return mapToPaymentDTO(updatedPayment);
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

  //  Get payment by stripe session ID :-

  async getPaymentByStripeSessionId(
    stripeSessionId: string
  ): Promise<PaymentResponseDTO> {
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

      return mapToPaymentDTO(payment);
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

export const paymentService = Container.get(PaymentService);

import { Types } from "mongoose";
import { PaymentResponseDTO, CreatePaymentDTO, UpdatePaymentStatusDTO } from "../../../dtos/user/payment.dto";

export interface IPaymentService {
  createPayment(paymentData: CreatePaymentDTO): Promise<PaymentResponseDTO>;
  getPaymentById(paymentId: Types.ObjectId): Promise<PaymentResponseDTO>;
  getPaymentByHostelId(hostelId: Types.ObjectId): Promise<PaymentResponseDTO>;
  updatePaymentStatus(paymentId: Types.ObjectId, status: UpdatePaymentStatusDTO): Promise<PaymentResponseDTO>;
  getPaymentByStripeSessionId(stripeSessionId: string): Promise<PaymentResponseDTO>;
}

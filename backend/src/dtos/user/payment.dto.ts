import { IHostelPayment, PaymentMetadata } from "../../models/payment.model";

export interface PaymentResponseDTO {
  _id: string;
  userId: string;
  hostelId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "expired" | "refunded";
  stripeSessionId?: string;
  // stripePaymentIntentId?: string;
  metadata?: PaymentMetadata;
  created_at: Date;
  updated_at: Date;
}

export interface  CreatePaymentDTO {
  userId: string;
  hostelId: string;
  bookingId: string;
  amount: number;
  currency?: string;
  metadata?: PaymentMetadata;
}

export interface UpdatePaymentStatusDTO {
  status: "pending" | "completed" | "failed" | "expired" | "refunded";
}

export function mapToPaymentDTO(payment: IHostelPayment): PaymentResponseDTO {
  return {
    _id: payment._id.toString(),
    userId: payment.userId.toString(),
    hostelId: payment.hostelId.toString(),
    bookingId: payment.bookingId.toString(),
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    stripeSessionId: payment.stripeSessionId,
    // stripePaymentIntentId: payment.stripePaymentId,
    metadata: payment.metadata,
    created_at: payment.createdAt,
    updated_at: payment.updatedAt,
  };
}

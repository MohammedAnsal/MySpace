export interface PaymentResponseDTO {
  _id: string;
  userId: string;
  hostelId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePaymentDTO {
  userId: string;
  hostelId: string;
  bookingId: string;
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface UpdatePaymentStatusDTO {
  status: "pending" | "completed" | "failed" | "refunded";
}

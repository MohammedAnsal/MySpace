import { Schema, model, Types } from "mongoose";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface IHostelPayment {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  providerId: Types.ObjectId;
  hostelId: Types.ObjectId;
  bookingId: Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  stripePaymentId: string;
  stripeSessionId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const HostelPaymentSchema = new Schema<IHostelPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    hostelId: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },

    stripePaymentId: { type: String },
    stripeSessionId: { type: String, required: true },
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

HostelPaymentSchema.index({ bookingId: 1 });
HostelPaymentSchema.index({ sessionId: 1 });
HostelPaymentSchema.index({ stripeSessionId: 1 });

export const HostelPaymentModel = model<IHostelPayment>(
  "Payment",
  HostelPaymentSchema
);

import { Types } from "mongoose";
import { IHostelPayment } from "../../../models/payment.model";

export interface IPaymentRepository {
  create(payment: Partial<IHostelPayment>): Promise<IHostelPayment>;
  findById(id: Types.ObjectId): Promise<IHostelPayment | null>;
  findByHostelId(hostelId: Types.ObjectId): Promise<IHostelPayment | null>;
  updateStatus(
    id: Types.ObjectId,
    status: string
  ): Promise<IHostelPayment | null>;
  findByStripeSessionId(
    stripeSessionId: string
  ): Promise<IHostelPayment | null>;
}

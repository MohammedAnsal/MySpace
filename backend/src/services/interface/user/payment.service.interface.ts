import { Types } from "mongoose";
import { IHostelPayment } from "../../../models/payment.model";

export interface IPaymentService {
  createPayment(paymentData: Partial<IHostelPayment>): Promise<IHostelPayment>;
  getPaymentById(paymentId: Types.ObjectId): Promise<IHostelPayment>;
  getPaymentByHostelId(hostelId: Types.ObjectId): Promise<IHostelPayment>;
  updatePaymentStatus(paymentId: Types.ObjectId, status: string): Promise<IHostelPayment>;
  getPaymentByStripeSessionId(stripeSessionId: string): Promise<IHostelPayment>;
}

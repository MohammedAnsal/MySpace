import { Types } from "mongoose";
import { ICleaning } from "../../../../models/facility/Cleaning/cleaning.model";

export interface ICleaningInput {
  userId: Types.ObjectId;
  providerId: Types.ObjectId;
  hostelId: Types.ObjectId;
  requestedDate: Date;
  preferredTimeSlot: string;
  specialInstructions?: string;
}

export interface ICleaningRepository {
  createCleaningRequest(requestData: ICleaningInput): Promise<ICleaning>;
  getUserCleaningRequests(userId: string): Promise<ICleaning[]>;
  getCleaningRequestById(requestId: string): Promise<ICleaning | null>;
  updateCleaningRequestStatus(
    requestId: string,
    status: string
  ): Promise<ICleaning | null>;
  cancelCleaningRequest(requestId: string): Promise<ICleaning | null>;
  getProviderCleaningRequests(providerId: string): Promise<ICleaning[]>;
  addFeedback(
    requestId: string,
    rating: number,
    comment?: string
  ): Promise<ICleaning | null>;
  getUserRecentBookings(userId: string, days: number): Promise<ICleaning[]>;
}

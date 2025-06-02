import { ICleaning } from "../../../models/facility/Cleaning/cleaning.model";
import { Types } from "mongoose";

// Request DTOs
export interface CreateCleaningRequestDTO {
  providerId: string;
  hostelId: string;
  facilityId: string;
  requestedDate: string;
  preferredTimeSlot: string;
  specialInstructions?: string;
}

export interface UpdateCleaningStatusDTO {
  status: string;
}

export interface AddFeedbackDTO {
  rating: number;
  comment?: string;
}

// Response DTOs
export interface CleaningResponseDTO {
  success: boolean;
  message: string;
  data?: ICleaning | ICleaning[] | null;
}

// Internal DTOs
export interface CleaningRequestDataDTO {
  userId: Types.ObjectId;
  providerId: Types.ObjectId;
  hostelId: Types.ObjectId;
  facilityId: Types.ObjectId;
  requestedDate: Date;
  preferredTimeSlot: string;
  specialInstructions?: string;
  status: string;
}

export interface FeedbackDataDTO {
  rating: number;
  comment?: string;
}

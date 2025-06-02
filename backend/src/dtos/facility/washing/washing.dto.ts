import { IWashing } from "../../../models/facility/Washing/washing.model";
import { Types } from "mongoose";

// Request DTOs
export interface CreateWashingRequestDTO {
  providerId: string;
  hostelId: string;
  facilityId: string;
  requestedDate: string;
  preferredTimeSlot: "Morning" | "Afternoon" | "Evening" | "Night";
  itemsCount: number;
  specialInstructions?: string;
}

export interface UpdateWashingStatusDTO {
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
}

export interface AddFeedbackDTO {
  rating: number;
  comment?: string;
}

// Response DTOs
export interface WashingResponseDTO {
  success: boolean;
  message: string;
  data?: IWashing | IWashing[] | null;
}

// Internal DTOs
export interface WashingRequestDataDTO {
  userId: Types.ObjectId;
  providerId: Types.ObjectId;
  hostelId: Types.ObjectId;
  facilityId: Types.ObjectId;
  requestedDate: Date;
  preferredTimeSlot: "Morning" | "Afternoon" | "Evening" | "Night";
  itemsCount: number;
  specialInstructions?: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
}

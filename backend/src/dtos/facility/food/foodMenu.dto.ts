import { IFoodMenu } from "../../../models/facility/Food/foodMenu.model";
import { Types } from "mongoose";

// Request DTOs
export interface UpdateFoodMenuDTO {
  menu?: {
    day: string;
    meals: {
      morning: { items: Types.ObjectId[]; isAvailable: boolean };
      noon: { items: Types.ObjectId[]; isAvailable: boolean };
      night: { items: Types.ObjectId[]; isAvailable: boolean };
    };
  }[];
}

export interface AddSingleDayMenuDTO {
  facilityId: string;
  hostelId: string;
  day: string;
  meals: {
    morning?: string[];
    noon?: string[];
    night?: string[];
  };
}

export interface CancelMealDTO {
  day: string;
  mealType: "morning" | "noon" | "night";
  isAvailable: boolean;
}

// Response DTOs
export interface FoodMenuResponseDTO {
  success: boolean;
  message: string;
  data?: IFoodMenu | null;
}

// Internal DTOs
export interface FoodMenuDataDTO {
  providerId: Types.ObjectId;
  facilityId: Types.ObjectId;
  hostelId: Types.ObjectId;
  menu: {
    day: string;
    meals: {
      morning: { items: Types.ObjectId[]; isAvailable: boolean };
      noon: { items: Types.ObjectId[]; isAvailable: boolean };
      night: { items: Types.ObjectId[]; isAvailable: boolean };
    };
  }[];
}

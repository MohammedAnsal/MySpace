import { IMenuItem } from "../../../models/facility/Food/menuItem.model";

// Request DTOs
export interface CreateMenuItemDTO {
  name: string;
  description: string;
  image: string;
  category: "Breakfast" | "Lunch" | "Dinner";
}

export interface UpdateMenuItemDTO {
  name?: string;
  description?: string;
  image?: string;
  category?: "Breakfast" | "Lunch" | "Dinner";
}

// Response DTOs
export interface MenuItemResponseDTO {
  success: boolean;
  message: string;
  data?: IMenuItem | IMenuItem[] | null;
}

// Internal DTOs
export interface MenuItemDataDTO extends Partial<IMenuItem> {
  name: string;
  description: string;
  image: string;
  category: "Breakfast" | "Lunch" | "Dinner";
} 
import { IUser } from "../../models/user.model";
import { IHostel } from "../../models/provider/hostel.model";

// Request DTOs
export interface AdminSearchDTO {
  searchQuery?: string;
}

export interface AdminVerifyHostelDTO {
  hostelId: string;
  reason: string;
  isVerified: boolean;
  isRejected: boolean;
}

// Response DTOs
export interface AdminUserResponseDTO {
  success: boolean;
  data: IUser[];
}

export interface AdminUserUpdateResponseDTO {
  success: boolean;
  message: string;
}

export interface AdminHostelResponseDTO {
  success: boolean;
  message: string;
  data?: IHostel | IHostel[] | null;
}

export interface AdminDashboardResponseDTO {
  bookings: number;
  users: number;
  providers: number;
  totalRevenue: number;
  revenueData: {
    weekly: Array<{
      week: string;
      revenue: number;
    }>;
    monthly: Array<{
      month: string;
      revenue: number;
    }>;
    yearly: Array<{
      year: number;
      revenue: number;
    }>;
  };
}

// Internal DTOs
export interface AdminWalletDTO {
  adminId?: string;
  balance: number;
  transactions: any[];
}

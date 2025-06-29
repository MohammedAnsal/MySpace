import { IUser } from "../../models/user.model";

export interface ProviderResponseDTO {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  profile_picture: string;
  role: string;
  is_verified: boolean;
  is_blocked: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateProviderDTO {
  fullName?: string;
  phone?: string;
  profile_picture?: string;
}

export interface ChangePasswordDTO {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface DashboardResponseDTO {
  hostels: number;
  bookings: number;
  users: number;
  totalRevenue: number;
  revenueData: {
    weekly: {
      week: string;
      revenue: number;
    }[];
    monthly: {
      month: string;
      revenue: number;
    }[];
    yearly: {
      year: number;
      revenue: number;
    }[];
  };
}

export function mapToProviderDTO(provider: IUser): ProviderResponseDTO {
  return {
    _id: provider._id.toString(),
    fullName: provider.fullName,
    email: provider.email,
    phone: provider.phone,
    profile_picture: provider.profile_picture,
    role: provider.role,
    is_verified: provider.is_verified,
    is_blocked: provider.is_blocked,
    created_at: provider.created_at,
    updated_at: provider.updated_at,
  };
}

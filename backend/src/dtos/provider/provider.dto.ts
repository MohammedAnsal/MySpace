import { IUser } from "../../models/user.model";

export interface ProviderResponseDTO {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  profile_picture: string;
  gender: "male" | "female" | "other";
  role: "user" | "provider";
  is_verified: boolean;
  is_active: boolean;
  is_blocked: boolean;
  created_at: Date;
  updated_at: Date;
  // Document verification fields
  documentType?: "aadhar" | "pan" | "passport" | "driving_license";
  documentImage?: string;
  isDocumentVerified?: boolean;
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

interface RevenueData {
  weekly: { week: string; revenue: number }[];
  monthly: { month: string; revenue: number }[];
  yearly: { year: number; revenue: number }[];
}

export interface ProviderDashboardDTO {
  hostels: number;
  bookings: number;
  users: number;
  totalRevenue: number;
  revenueData: RevenueData;
}

export function mapToProviderDTO(provider: IUser): ProviderResponseDTO {
  return {
    _id: provider._id.toString(),
    fullName: provider.fullName,
    email: provider.email,
    phone: provider.phone,
    profile_picture: provider.profile_picture,
    gender: provider.gender,
    role: provider.role,
    is_verified: provider.is_verified,
    is_active: provider.is_active,
    isDocumentVerified: provider.isDocumentVerified,
    documentType: provider.documentType,
    documentImage: provider.documentImage,
    is_blocked: provider.is_blocked,
    created_at: provider.created_at,
    updated_at: provider.updated_at,
  };
}

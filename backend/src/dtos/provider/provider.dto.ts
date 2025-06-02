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

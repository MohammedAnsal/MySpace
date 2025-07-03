import { useQuery } from "@tanstack/react-query";
import {
  getAllProviders,
  getAllUsers,
  getUnverifiedHostels,
  getHostelById,
  getVerifiedHostels,
  listAdminBookings,
  getAdminDashboard,
  getAdminWallet,
  getAdminTransactions,
} from "@/services/Api/admin/adminApi";

// Add type for paginated user response if not already present
interface AdminUserResponseDTO {
  success: boolean;
  data: any[]; // Replace with IUser[] if you have the type
  total?: number;
  page?: number;
  limit?: number;
}

const fetchUsers = async (
  searchQuery?: string,
  page: number = 1,
  limit: number = 10
): Promise<AdminUserResponseDTO> => {
  // getAllUsers should return the full paginated response
  return await getAllUsers(searchQuery, page, limit);
};

const fetchProviders = async (
  searchQuery?: string,
  page: number = 1,
  limit: number = 10
) => {
  const { data } = await getAllProviders(searchQuery, page, limit);
  return data;
};

const fetchUnverifiedHostels = async () => {
  const response = await getUnverifiedHostels();
  return response;
};

const fetchHostelById = async (id: string) => {
  const response = await getHostelById(id);
  return response;
};

const fetchVerifiedHostels = async () => {
  const response = await getVerifiedHostels();
  return response;
};

// Updated useUsers hook for server-side pagination
export const useUsers = (
  searchQuery?: string,
  page: number = 1,
  limit: number = 5
) => {
  return useQuery<AdminUserResponseDTO>({
    queryKey: ["admin-users", searchQuery, page, limit],
    queryFn: () => fetchUsers(searchQuery, page, limit),
    // keepPreviousData: true,
  });
};

export const useProviders = (
  searchQuery?: string,
  page: number = 1,
  limit: number = 5
) => {
  return useQuery({
    queryKey: ["admin-providers", searchQuery, page, limit],
    queryFn: () => fetchProviders(searchQuery, page, limit),
  });
};

export const useUnverifiedHostels = () => {
  return useQuery({
    queryKey: ["unverified-hostels"],
    queryFn: fetchUnverifiedHostels,
  });
};

export const useHostelDetails = (id: string) => {
  return useQuery({
    queryKey: ["hostel", id],
    queryFn: () => fetchHostelById(id),
    enabled: !!id,
  });
};

export const useVerifiedHostels = () => {
  return useQuery({
    queryKey: ["verified-hostels"],
    queryFn: fetchVerifiedHostels,
  });
};

const fetchAdminBookings = async () => {
  const response = await listAdminBookings();
  return response ?? [];
};

export const useProviderBookings = () => {
  return useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => fetchAdminBookings(),
  });
};

interface DashboardData {
  users: number;
  providers: number;
  hostels: number;
  bookings: number;
  totalRevenue: number;
  revenueData?: {
    weekly: Array<{ week: string; revenue: number }>;
    monthly: Array<{ month: string; revenue: number }>;
    yearly: Array<{ year: number; revenue: number }>;
  };
}

const fetchAdminDashboard = async (): Promise<DashboardData> => {
  const response = await getAdminDashboard();
  return response || { 
    users: 0, 
    providers: 0,
    hostels: 0, 
    bookings: 0, 
    totalRevenue: 0,
    revenueData: {
      weekly: [],
      monthly: [],
      yearly: []
    }
  };
};

export const useAdminDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboard,
  });
};

interface Transaction {
  _id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  bookingId?: string;
  created_at: string;
}

interface WalletData {
  _id: string;
  adminId: string;
  balance: number;
  transactions: Transaction[];
  created_at: string;
  updatedAt: string;
}

const fetchAdminWallet = async (): Promise<WalletData | null> => {
  const response = await getAdminWallet();
  return response?.data || null;
};

const fetchAdminTransactions = async (): Promise<Transaction[]> => {
  const response = await getAdminTransactions();
  return response?.data || [];
};

export const useAdminWallet = () => {
  return useQuery<WalletData | null>({
    queryKey: ["admin-wallet"],
    queryFn: fetchAdminWallet,
  });
};

export const useAdminTransactions = () => {
  return useQuery<Transaction[]>({
    queryKey: ["admin-transactions"],
    queryFn: fetchAdminTransactions,
  });
};

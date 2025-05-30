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

const fetchUsers = async (searchQuery?: string) => {
  const { data } = await getAllUsers(searchQuery);
  return data;
};

const fetchProviders = async (searchQuery?: string) => {
  const { data } = await getAllProviders(searchQuery);
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

export const useUsers = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["admin-users", searchQuery],
    queryFn: () => fetchUsers(searchQuery),
  });
};

export const useProviders = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["admin-providers", searchQuery],
    queryFn: () => fetchProviders(searchQuery),
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
  createdAt: string;
}

interface WalletData {
  _id: string;
  adminId: string;
  balance: number;
  transactions: Transaction[];
  createdAt: string;
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

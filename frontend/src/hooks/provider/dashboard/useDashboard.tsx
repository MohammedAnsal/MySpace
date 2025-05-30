import { useQuery } from "@tanstack/react-query";
import { getProviderDashboard } from "@/services/Api/providerApi";

interface DashboardData {
  users: number;
  hostels: number;
  bookings: number;
  totalRevenue: number;
  revenueData?: {
    weekly: Array<{ week: string; revenue: number }>;
    monthly: Array<{ month: string; revenue: number }>;
    yearly: Array<{ year: number; revenue: number }>;
  };
}

const fetchProviderDashboard = async (): Promise<DashboardData> => {
  const response = await getProviderDashboard();
  return (
    response || {
      users: 0,
      hostels: 0,
      bookings: 0,
      totalRevenue: 0,
      revenueData: {
        weekly: [],
        monthly: [],
        yearly: [],
      },
    }
  );
};

export const useProviderDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["provider-dashboard"],
    queryFn: fetchProviderDashboard,
  });
}; 
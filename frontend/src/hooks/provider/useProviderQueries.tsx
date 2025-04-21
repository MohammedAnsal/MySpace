import { useQuery } from "@tanstack/react-query";
import {
  findProvider,
  getProviderDashboard,
  listAllHostels,
  listProviderBookings,
} from "@/services/Api/providerApi";
// Import UserProfile from the correct location
import { ProviderProfile } from "@/pages/provider/Profile/Profile";
import { Hostel } from "@/types/api.types";

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

const fetchProviderProfile = async (): Promise<ProviderProfile | null> => {
  try {
    const response = await findProvider();
    // **IMPORTANT:** Check the actual response structure from your 'findProvider' API call.
    // It might be response.data, response.data.data, or something else.
    // Adjust the line below accordingly.
    return response?.data?.data || null;
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    return null;
  }
};

export const useProviderProfile = () => {
  return useQuery<ProviderProfile | null>({
    queryKey: ["providerProfile"],
    queryFn: fetchProviderProfile,
    // Add staleTime if desired, e.g., to avoid refetching too often
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch function for provider's hostels
const fetchProviderHostels = async (): Promise<Hostel[]> => {
  try {
    // Call the listAllHostels function from providerApi
    const response = await listAllHostels();
    console.log(response);
    // **IMPORTANT:** Verify the structure returned by your provider `listAllHostels`.
    // It should return an array of hostels. Adjust if needed.
    return response || []; // Return the hostel array or an empty array
  } catch (error) {
    console.error("Error fetching provider hostels:", error);
    return []; // Return empty array on error
  }
};

// New hook for provider's hostels
export const useProviderHostels = () => {
  return useQuery<Hostel[]>({
    // Specify the return type as Hostel[]
    queryKey: ["provider-hostels"], // Keep the same query key used before
    queryFn: fetchProviderHostels,
    // Optional: Add staleTime or cacheTime if desired
  });
};

const fetchProviderBookings = async () => {
  const response = await listProviderBookings();
  return response ?? [];
};

export const useProviderBookings = () => {
  return useQuery({
    queryKey: ["provider-bookings"],
    queryFn: () => fetchProviderBookings(),
  });
};

const fetchProviderDashboard = async (): Promise<DashboardData> => {
  const response = await getProviderDashboard();
  return response || { 
    users: 0, 
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

export const useProviderDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["provider-dashboard"],
    queryFn: fetchProviderDashboard,
  });
};
 
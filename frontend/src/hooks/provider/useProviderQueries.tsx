import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  findProvider,
  getProviderDashboard,
  listAllHostels,
  listProviderBookings,
  getProviderWallet,
  getWalletTransactions,
  createMenuItem,
  getAllMenuItems,
  getMenuItemsByCategory,
  updateMenuItem,
  deleteMenuItem,
  // createFoodMenu,
  getFoodMenu,
  updateFoodMenu,
  deleteFoodMenu,
  addSingleDayMenu,
  getProviderWashingRequests,
  updateWashingRequestStatus,
  getProviderCleaningRequests,
  updateCleaningRequestStatus as updateCleaningStatus,
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

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: "Breakfast" | "Lunch" | "Dinner";
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMeal {
  items: string[];
  isAvailable: boolean;
}

export interface IDayMeal {
  day: string;
  meals: {
    morning: IMeal;
    noon: IMeal;
    night: IMeal;
  };
}

export interface IFoodMenu {
  _id: string;
  facilityId: string;
  providerId: string;
  menu: IDayMeal[];
  createdAt: string;
  updatedAt: string;
}

export interface WashingRequest {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  hostelId: {
    _id: string;
    hostel_name: string;
    location: string;
  };
  requestedDate: string;
  preferredTimeSlot: string;
  itemsCount: number;
  specialInstructions?: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  feedback?: {
    rating: number;
    comment?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CleaningRequest {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  hostelId: {
    _id: string;
    hostel_name: string;
    location: string;
  };
  requestedDate: string;
  preferredTimeSlot: string;
  specialInstructions?: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  feedback?: {
    rating: number;
    comment?: string;
  };
  createdAt: string;
  updatedAt: string;
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

const fetchProviderWallet = async () => {
  try {
    const response = await getProviderWallet();
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching provider wallet:", error);
    return null;
  }
};

const fetchWalletTransactions = async () => {
  try {
    const response = await getWalletTransactions();
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    return [];
  }
};

export const useProviderWallet = () => {
  return useQuery({
    queryKey: ["provider-wallet"],
    queryFn: fetchProviderWallet,
  });
};

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: ["wallet-transactions"],
    queryFn: fetchWalletTransactions,
  });
};

// Query hook for fetching all menu items
export const useMenuItems = () => {
  return useQuery<MenuItem[]>({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const response = await getAllMenuItems();
      return response?.data || [];
    },
  });
};

// Query hook for fetching menu items by category
export const useMenuItemsByCategory = (category: string) => {
  return useQuery<MenuItem[]>({
    queryKey: ["menu-items", category],
    queryFn: async () => {
      const response = await getMenuItemsByCategory(category);
      return response?.data || [];
    },
    enabled: !!category,
  });
};

// Mutation hook for creating menu items
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createMenuItem(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
};

// Mutation hook for updating menu items
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateMenuItem(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
};

// Mutation hook for deleting menu items
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
};

// Query hook for fetching food menu
export const useFoodMenu = (facilityId: string , hostelId:string) => {
  return useQuery<IFoodMenu>({
    queryKey: ["food-menu", facilityId],
    queryFn: async () => {
      const response = await getFoodMenu(facilityId, hostelId);
      return response?.data;
    },
    enabled: !!facilityId,
    refetchOnMount: true,
    staleTime: 0, // This ensures data is considered stale immediately
  });
};

// Mutation hook for creating food menu
// export const useCreateFoodMenu = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       providerId,
//       facilityId,
//     }: {
//       providerId: string;
//       facilityId: string;
//     }) => createFoodMenu(providerId, facilityId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ["food-menu", variables.facilityId],
//       });
//     },
//   });
// };

// Mutation hook for updating food menu
export const useUpdateFoodMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      menuData,
    }: {
      id: string;
      menuData: Partial<IFoodMenu>;
    }) => updateFoodMenu(id, menuData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["food-menu",variables.id],
      });
    },
  });
};

// Mutation hook for deleting food menu
export const useDeleteFoodMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, day, mealType }: { 
      id: string; 
      day: string; 
      mealType: "morning" | "noon" | "night" 
    }) => deleteFoodMenu(id, day, mealType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["food-menu"],
      });
    },
  });
};

// Mutation hook for adding single day menu
export const useAddSingleDayMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      hostelId,
      day,
      meals,
    }: {
      facilityId: string;
      hostelId: string;
      day: string;
      meals: {
        morning?: string[];
        noon?: string[];
        night?: string[];
      };
    }) => addSingleDayMenu(facilityId, hostelId, day, meals),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["food-menu", variables.facilityId],
      });
    },
  });
};

// Function to fetch provider washing requests
const fetchProviderWashingRequests = async (): Promise<WashingRequest[]> => {
  try {
    const response = await getProviderWashingRequests();
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching provider washing requests:", error);
    return [];
  }
};

// Query hook for provider washing requests
export const useProviderWashingRequests = () => {
  return useQuery<WashingRequest[]>({
    queryKey: ["provider-washing-requests"],
    queryFn: fetchProviderWashingRequests,
  });
};

// Mutation hook for updating washing request status
export const useUpdateWashingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      updateWashingRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-washing-requests"] });
    },
  });
};

// Function to fetch provider cleaning requests
const fetchProviderCleaningRequests = async (): Promise<CleaningRequest[]> => {
  try {
    const response = await getProviderCleaningRequests();
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching provider cleaning requests:", error);
    return [];
  }
};

// Query hook for provider cleaning requests
export const useProviderCleaningRequests = () => {
  return useQuery<CleaningRequest[]>({
    queryKey: ["provider-cleaning-requests"],
    queryFn: fetchProviderCleaningRequests,
  });
};

// Mutation hook for updating cleaning request status
export const useUpdateCleaningStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      updateCleaningStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-cleaning-requests"] });
    },
  });
};

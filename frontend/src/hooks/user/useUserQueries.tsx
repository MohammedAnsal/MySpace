import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAllHostels,
  hostelDetails,
  findUser,
  listHostelsHome,
  listUserBookings,
  findNearbyHostels,
  getHostelRatings,
  getUserRating,
  getUserWallet,
  getWalletTransactions,
  getFoodMenu,
  getUserWashingRequests,
  createWashingRequest,
  cancelWashingRequest,
  getUserCleaningRequests,
  createCleaningRequest,
  cancelCleaningRequest,
  addCleaningFeedback,
  // getWashingRequestById,
} from "@/services/Api/userApi";
import { HostelFilters } from "@/types/api.types";
import UserProfile from "@/pages/user/Home/profile/UserProfile";

const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await findUser();
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

const fetchHostels = async (filters: HostelFilters) => {
  const response = await listAllHostels(filters);
  return response ?? [];
};

const fetchHostelDetails = async (id: string) => {
  const response = await hostelDetails(id);
  return response;
};

const fetchHosteslsHome = async () => {
  const response = await listHostelsHome();
  return response ?? [];
};

const fetchUserBookings = async () => {
  const response = await listUserBookings();
  return response ?? [];
};

const fetchNearbyHostels = async (params: {
  latitude: number;
  longitude: number;
  radius?: number;
}) => {
  const { latitude, longitude, radius } = params;
  const response = await findNearbyHostels(latitude, longitude, radius);
  return response ?? [];
};

const fetchHostelRatings = async (hostelId: string | undefined) => {
  if (!hostelId) return { ratings: [], averageRating: 0, totalRatings: 0 };

  try {
    const response = await getHostelRatings(hostelId);
    return response?.data || { ratings: [], averageRating: 0, totalRatings: 0 };
  } catch (error) {
    console.error("Error fetching hostel ratings:", error);
    return { ratings: [], averageRating: 0, totalRatings: 0 };
  }
};

const fetchUserRating = async (hostelId: string, bookingId: string) => {
  if (!bookingId || !hostelId) return null;

  try {
    const response = await getUserRating(hostelId, bookingId);
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return null;
  }
};

const fetchUserWallet = async () => {
  try {
    const response = await getUserWallet();
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching user wallet:", error);
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

export const useUserProfile = () => {
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    // Optional: Add staleTime or cacheTime if needed
    // staleTime: 5 * 60 * 1000, // e.g., 5 minutes
  });
};

export const useHostels = (filters: HostelFilters) => {
  return useQuery({
    queryKey: ["hostels", filters],
    queryFn: () => fetchHostels(filters),
  });
};

export const useHostelDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ["hostel", id],
    queryFn: () => fetchHostelDetails(id!),
    enabled: !!id,
  });
};

export const useHostelsHome = () => {
  return useQuery({
    queryKey: ["hostels-home"],
    queryFn: () => fetchHosteslsHome(),
  });
};

export const useUserBookings = () => {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => fetchUserBookings(),
  });
};

export const useNearbyHostels = (
  latitude: number | null,
  longitude: number | null,
  radius?: number
) => {
  return useQuery({
    queryKey: ["nearby-hostels", { latitude, longitude, radius }],
    queryFn: () =>
      fetchNearbyHostels({
        latitude: latitude!,
        longitude: longitude!,
        radius,
      }),
    enabled: !!latitude && !!longitude,
  });
};

export const useHostelRatings = (hostelId: string | undefined) => {
  return useQuery({
    queryKey: ["hostel-ratings", hostelId],
    queryFn: () => fetchHostelRatings(hostelId),
    enabled: !!hostelId,
  });
};

export const useUserRating = (hostelId: string, bookingId: string) => {
  return useQuery({
    queryKey: ["user-rating", bookingId, hostelId],
    queryFn: () => fetchUserRating(hostelId, bookingId),
    enabled: !!bookingId && !!hostelId,
  });
};

export const useUserWallet = () => {
  return useQuery({
    queryKey: ["user-wallet"],
    queryFn: fetchUserWallet,
  });
};

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: ["wallet-transactions"],
    queryFn: fetchWalletTransactions,
  });
};

export const useFoodMenu = (facilityId: string, hostelId: string) => {
  return useQuery({
    queryKey: ["food-menu", facilityId],
    queryFn: async () => {
      try {
        const response = await getFoodMenu(facilityId, hostelId);
        return response?.data;
      } catch (error: any) {
        // Check if it's the specific "Food menu not found" error
        if (error.response?.data?.message === "Food menu not found") {
          return null; // Return null instead of throwing error
        }
        throw error; // Throw other errors
      }
    },
    enabled: !!facilityId,
    // refetchOnMount: true,
    // staleTime: 0
  });
};

export const useUserWashingRequests = () => {
  return useQuery({
    queryKey: ["washing-requests"],
    queryFn: () => getUserWashingRequests(),
    refetchOnWindowFocus: true
  });
};

// export const useWashingRequestById = (id: string | undefined) => {
//   return useQuery({
//     queryKey: ["washing-request", id],
//     queryFn: () => getWashingRequestById(id!),
//     enabled: !!id
//   });
// };

export const useCreateWashingRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      providerId: string;
      hostelId: string;
      facilityId: string;
      requestedDate: string;
      preferredTimeSlot: string;
      itemsCount: number;
      specialInstructions?: string;
    }) => createWashingRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["washing-requests"] });
    }
  });
};

export const useCancelWashingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelWashingRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["washing-requests"] });
    },
  });
};

export const useUserCleaningRequests = () => {
  return useQuery({
    queryKey: ["cleaning-requests"],
    queryFn: () => getUserCleaningRequests(),
    refetchOnWindowFocus: true
  });
};

export const useCreateCleaningRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      providerId: string;
      hostelId: string;
      facilityId:string
      requestedDate: string;
      preferredTimeSlot: string;
      specialInstructions?: string;
    }) => createCleaningRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaning-requests"] });
    }
  });
};

export const useCancelCleaningRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelCleaningRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaning-requests"] });
    },
  });
};

export const useAddCleaningFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating, comment }: { id: string; rating: number; comment?: string }) => 
      addCleaningFeedback(id, rating, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaning-requests"] });
    },
  });
};

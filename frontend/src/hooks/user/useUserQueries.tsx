import { useQuery } from "@tanstack/react-query";
import {
  listAllHostels,
  hostelDetails,
  findUser,
  listHostelsHome,
  listUserBookings,
  findNearbyHostels,
  getHostelRatings,
  getUserRating,
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

const fetchUserRating = async (userId: string, hostelId: string) => {
  if (!userId || !hostelId) return null;
  
  try {
    const response = await getUserRating(userId, hostelId);
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return null;
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

export const useUserRating = (userId: string, hostelId: string) => {
  return useQuery({
    queryKey: ["user-rating", userId, hostelId],
    queryFn: () => fetchUserRating(userId, hostelId),
    enabled: !!userId && !!hostelId,
  });
};

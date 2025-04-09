import { useQuery } from "@tanstack/react-query";
import { listAllHostels, hostelDetails, findUser } from "@/services/Api/userApi";
import { HostelFilters } from "@/types/api.types";
import UserProfile from "@/pages/user/Home/profile/UserProfile";

const fetchHostels = async (filters: HostelFilters) => {
  const response = await listAllHostels(filters);
  // Ensure we return an empty array if response is undefined, matching useQuery's expected return type
  return response ?? [];
};

export const useHostels = (filters: HostelFilters) => {
  return useQuery({
    queryKey: ["hostels", filters],
    queryFn: () => fetchHostels(filters),
  });
};

// Fetch function for hostel details
const fetchHostelDetails = async (id: string) => {
  const response = await hostelDetails(id);
  return response;
};

// New hook for hostel details
export const useHostelDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ["hostel", id],
    queryFn: () => fetchHostelDetails(id!), // Use non-null assertion as 'enabled' handles undefined id
    // Only run the query if the id is present and valid
    enabled: !!id,
  });
};

// Fetch function for user profile
const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await findUser();
    // Adjust based on the actual structure of the response from findUser()
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Return null or throw error depending on how you want useQuery to handle it
    return null;
  }
};

// New hook for user profile
export const useUserProfile = () => {
  return useQuery<UserProfile | null>({ // Specify the return type
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    // Optional: Add staleTime or cacheTime if needed
    // staleTime: 5 * 60 * 1000, // e.g., 5 minutes
  });
};

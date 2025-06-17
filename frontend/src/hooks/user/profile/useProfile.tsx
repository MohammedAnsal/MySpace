import { useQuery } from "@tanstack/react-query";
import { findUser } from "@/services/Api/userApi";
import UserProfile from "@/pages/user/home/profile/UserProfile";

const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await findUser();
    return response.data || null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const useUserProfile = () => {
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });
}; 
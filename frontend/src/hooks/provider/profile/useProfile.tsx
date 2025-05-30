import { useQuery } from "@tanstack/react-query";
import { findProvider } from "@/services/Api/providerApi";
import { ProviderProfile } from "@/pages/provider/Profile/Profile";

const fetchProviderProfile = async (): Promise<ProviderProfile | null> => {
  try {
    const response = await findProvider();
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
  });
}; 
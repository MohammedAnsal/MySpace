import { useQuery } from "@tanstack/react-query";
import { listAllHostels } from "@/services/Api/providerApi";
import { Hostel } from "@/types/api.types";

const fetchProviderHostels = async (): Promise<Hostel[]> => {
  try {
    const response = await listAllHostels();
    return response || [];
  } catch (error) {
    console.error("Error fetching provider hostels:", error);
    return [];
  }
};

export const useProviderHostels = () => {
  return useQuery<Hostel[]>({
    queryKey: ["provider-hostels"],
    queryFn: fetchProviderHostels,
  });
}; 
import { useQuery } from "@tanstack/react-query";
import { listProviderBookings } from "@/services/Api/providerApi";

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
import { useQuery } from "@tanstack/react-query";
import {
  listUserBookings,
  listUserBookingsDetails,
} from "@/services/Api/userApi";

const fetchUserBookings = async () => {
  const response = await listUserBookings();
  return response ?? [];
};

export const useUserBookings = () => {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => fetchUserBookings(),
  });
};

const fetchUserBookingsDetails = async (bookingId: string) => {
  const response = await listUserBookingsDetails(bookingId);
  return response ?? [];
};

export const useUserBookingsDetails = (bookingId: string) => {
  return useQuery({
    queryKey: ["user-bookings-details"],
    queryFn: () => fetchUserBookingsDetails(bookingId),
  });
};

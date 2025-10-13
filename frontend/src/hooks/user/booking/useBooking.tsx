import { useMutation, useQuery } from "@tanstack/react-query";
import {
  // addFacilitiesToBooking,
  listUserBookings,
  listUserBookingsDetails,
  cancelBooking,
  reprocessBookingPayment,
  processMonthlyPayment,
} from "@/services/Api/userApi";
import { createFacilityPaymentSession } from "@/services/Api/userApi";

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

// export const useAddFacilitiesToBooking = () => {
//   return useMutation({
//     mutationFn: ({
//       bookingId,
//       facilities,
//     }: {
//       bookingId: string;
//       facilities: { id: string; startDate: string; duration: number }[];
//     }) => addFacilitiesToBooking(bookingId, facilities),
//   });
// };

export const useCancelBooking = () => {
  return useMutation({
    mutationFn: ({
      bookingId,
      reason,
    }: {
      bookingId: string;
      reason: string;
    }) => cancelBooking(bookingId, reason),
  });
};

export const useReprocessBookingPayment = () => {
  return useMutation({
    mutationFn: (bookingId: string) => reprocessBookingPayment(bookingId),
  });
};

export const useFacilityPayment = () => {
  return useMutation({
    mutationFn: ({
      bookingId,
      facilities,
    }: {
      bookingId: string;
      facilities: { id: string; startDate: string; duration: number }[];
    }) => createFacilityPaymentSession(bookingId, facilities),
  });
};

export const useMonthlyPayment = () => {
  return useMutation({
    mutationFn: ({ bookingId, month }: { bookingId: string; month: number }) =>
      processMonthlyPayment(bookingId, month),
  });
};

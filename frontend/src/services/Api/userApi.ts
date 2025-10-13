import {
  publicAxiosInstance,
  userAxiosInstance,
} from "../axiosInstance/userInstance";
import { HostelFilters, ApiResponse, Hostel } from "@/types/api.types";

const api = userAxiosInstance;
const publicApi = publicAxiosInstance;

const handleResponse = (response: any, message: string) => {
  if (!response) console.error(message);
  return response;
};

const handleError = (error: any) => {
  console.error(error);
  throw error;
};

export const signUpRequest = async (formData: object) => {
  try {
    const response = await publicApi.post("/auth/sign-up", formData);
    return handleResponse(response, "Error in sign-up request");
  } catch (error) {
    handleError(error);
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await publicApi.post("/auth/verify-otp", { email, otp });
    return handleResponse(response, "Error in OTP verification");
  } catch (error) {
    handleError(error);
  }
};

export const signInRequest = async (formData: object) => {
  try {
    const response = await api.post("/auth/sign-in", formData);
    return handleResponse(response, "Error in sign-in request");
  } catch (error) {
    handleError(error);
  }
};

export const resendOtp = async (email: string) => {
  try {
    const response = await publicApi.post("/auth/resend-otp", { email });
    return handleResponse(response, "Error in resending OTP");
  } catch (error) {
    handleError(error);
  }
};

export const userLogout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return handleResponse(response, "Error in logout");
  } catch (error) {
    handleError(error);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await publicApi.post("/auth/forgot-password", { email });
    return handleResponse(response, "Error in forgot password request");
  } catch (error) {
    handleError(error);
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await publicApi.put("/auth/reset-password", {
      email,
      newPassword,
    });
    return handleResponse(response, "Error in reset password request");
  } catch (error) {
    handleError(error);
  }
};

export const googleRequest = async (token: string) => {
  try {
    const response = await api.post(
      "/auth/google-signIn",
      { token },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const findUser = async () => {
  try {
    const response = await api.get("/user/profile");
    return handleResponse(response.data, "Error in finding user profile");
  } catch (error) {
    handleError(error);
  }
};

export const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    const response = await api.post("/user/change-password", {
      email,
      currentPassword,
      newPassword,
    });
    return handleResponse(response.data, "Error in changing user password");
  } catch (error) {
    handleError(error);
  }
};

export const editProfile = async (formData: FormData) => {
  try {
    const response = await api.put("/user/edit-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response.data, "Error in edit user profile");
  } catch (error) {
    handleError(error);
  }
};

export const listAllHostels = async (
  filters?: HostelFilters
): Promise<Hostel[] | undefined> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      if (filters.minPrice)
        queryParams.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice)
        queryParams.append("maxPrice", filters.maxPrice.toString());
      if (filters.gender) queryParams.append("gender", filters.gender);
      if (filters.amenities?.length)
        queryParams.append("amenities", filters.amenities.join(","));
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.minRating !== undefined)
        queryParams.append("minRating", filters.minRating.toString());
      if (filters.sortByRating !== undefined)
        queryParams.append("sortByRating", filters.sortByRating.toString());
    }

    const response = await api.get<ApiResponse<Hostel[]>>(
      `/user/verified-hostels?${queryParams.toString()}`
    );
    return handleResponse(response.data.data, "Error in list hostel");
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

export const listHostelsHome = async () => {
  try {
    const response = await api.get("/user/home-hostels");

    return handleResponse(
      response.data,
      "Error in all list hostels in home side"
    );
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

export const hostelDetails = async (hostelId: string) => {
  try {
    const response = await api.get(`/user/hostel/${hostelId}`);
    return handleResponse(response.data.data, "Error in list details hostel");
  } catch (error) {
    handleError(error);
  }
};

export const bookingHostel = async (bookingData: FormData) => {
  try {
    const bookingResponse = await api.post(
      "/user/create-booking",
      bookingData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!bookingResponse.data?.data?._id) {
      throw new Error("Booking creation failed");
    }

    const paymentResponse = await api.post(`/user/payments/booking`, {
      hostelId: bookingResponse.data.data.hostelId._id,
      userId: bookingResponse.data.data.userId._id,
      providerId: bookingResponse.data.data.providerId,
      bookingId: bookingResponse.data.data._id,
      amount: bookingResponse.data.data.firstMonthRent,
      currency: "USD",
      metadata: {
        bookingId: bookingResponse.data.data._id,
        stayDuration: bookingResponse.data.data.stayDurationInMonths,
      },
    });

    if (paymentResponse.data?.data?.checkoutUrl) {
      window.location.href = paymentResponse.data.data.checkoutUrl;
    } else {
      throw new Error("Payment session creation failed");
    }

    return bookingResponse.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const listUserBookings = async () => {
  try {
    const response = await api.get("/user/bookings");

    return handleResponse(response.data.data, "Error in list user bookings");
  } catch (error) {
    handleError(error);
  }
};

export const listUserBookingsDetails = async (bookingId: string) => {
  try {
    const response = await api.get(`/user/bookings/${bookingId}`);

    return handleResponse(response.data.data, "Error in list user bookings");
  } catch (error) {
    handleError(error);
  }
};

export const findNearbyHostels = async (
  latitude: number,
  longitude: number,
  radius: number = 5
): Promise<Hostel[] | undefined> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("latitude", latitude.toString());
    queryParams.append("longitude", longitude.toString());
    queryParams.append("radius", radius.toString());

    const response = await api.get<ApiResponse<Hostel[]>>(
      `/user/nearby-hostels?${queryParams.toString()}`
    );
    return handleResponse(response.data.data, "Error finding nearby hostels");
  } catch (error) {
    handleError(error);
    return undefined;
  }
};

export const createRating = async (ratingData: {
  user_id: string;
  hostel_id: string;
  rating: number;
  comment?: string;
}) => {
  try {
    const response = await api.post("/user/create-rating", ratingData);
    return handleResponse(response.data, "Error in creating rating");
  } catch (error) {
    handleError(error);
  }
};

export const getHostelRatings = async (hostelId: string) => {
  try {
    const response = await api.get(`/user/hostel/${hostelId}/ratings`);
    return handleResponse(response.data, "Error fetching hostel ratings");
  } catch (error) {
    handleError(error);
    return { ratings: [], averageRating: 0, totalRatings: 0 };
  }
};

export const getUserRating = async (hostelId: string, bookingId: string) => {
  try {
    const response = await api.get(`/user/${hostelId}/${bookingId}`);
    return handleResponse(response.data, "Error fetching user rating");
  } catch (error) {
    handleError(error);
    return { success: false, data: null };
  }
};

export const reprocessBookingPayment = async (bookingId: string) => {
  try {
    const response = await api.post(
      `/user/payments/reprocess-payment/${bookingId}`
    );
    return handleResponse(response.data, "Error reprocessing payment");
  } catch (error) {
    handleError(error);
  }
};

export const cancelBooking = async (bookingId: string, reason: string) => {
  try {
    const response = await api.post(`/user/cancel/${bookingId}`, { reason });
    return handleResponse(response.data, "Error cancelling booking");
  } catch (error) {
    handleError(error);
  }
};

export const getUserWallet = async () => {
  try {
    const response = await api.get("/user/user-wallet");
    return handleResponse(response.data, "Error fetching user wallet");
  } catch (error) {
    handleError(error);
    return { success: false, data: null };
  }
};

export const getWalletTransactions = async () => {
  try {
    const response = await api.get("/user/transactions");
    return handleResponse(response.data, "Error fetching wallet transactions");
  } catch (error) {
    handleError(error);
    return { success: false, data: [] };
  }
};

//  Food Facility :-

export const getFoodMenu = async (facilityId: string, hostelId: string) => {
  try {
    const response = await api.get(
      `/facility/food-menu/${facilityId}/${hostelId}`
    );
    return handleResponse(response.data, "Error fetching food menu");
  } catch (error) {
    handleError(error);
  }
};

export const cancelMeal = async (
  menuId: string,
  day: string,
  mealType: string,
  isAvailable: boolean
) => {
  try {
    const response = await api.put(
      `/facility/food-menu/${menuId}/cancel-meal`,
      {
        day,
        mealType,
        isAvailable,
      }
    );
    return handleResponse(response.data, "Error updating meal availability");
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
};

//  Washing Facility

export const createWashingRequest = async (data: {
  providerId: string;
  hostelId: string;
  facilityId: string;
  requestedDate: string;
  preferredTimeSlot: string;
  itemsCount: number;
  specialInstructions?: string;
}) => {
  try {
    const response = await api.post("/facility/washing/create", data);
    return handleResponse(response.data, "Error creating washing request");
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
};

export const getUserWashingRequests = async () => {
  try {
    const response = await api.get("/facility/washing/user");
    return handleResponse(
      response.data.data,
      "Error fetching washing requests"
    );
  } catch (error) {
    handleError(error);
    return { success: false, data: [] };
  }
};

export const cancelWashingRequest = async (id: string) => {
  try {
    const response = await api.post(`/facility/washing/${id}/cancel`);
    return handleResponse(response.data, "Error cancelling washing request");
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
};

// Cleaning Facility
export const createCleaningRequest = async (data: {
  providerId: string;
  hostelId: string;
  facilityId: string;
  requestedDate: string;
  preferredTimeSlot: string;
  specialInstructions?: string;
}) => {
  try {
    const response = await api.post("/facility/cleaning/create", data);
    return handleResponse(response.data, "Error creating cleaning request");
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
};

export const getUserCleaningRequests = async () => {
  try {
    const response = await api.get("/facility/cleaning/user");
    return handleResponse(response.data, "Error fetching cleaning requests");
  } catch (error) {
    handleError(error);
    return { success: false, data: [] };
  }
};

export const cancelCleaningRequest = async (id: string) => {
  try {
    const response = await api.post(`/facility/cleaning/${id}/cancel`);
    return handleResponse(response.data, "Error cancelling cleaning request");
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
};

export const addCleaningFeedback = async (
  id: string,
  rating: number,
  comment?: string
) => {
  try {
    const response = await api.post(`/facility/cleaning/${id}/feedback`, {
      rating,
      comment,
    });
    return handleResponse(response.data, "Error adding cleaning feedback");
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
};

// export const addFacilitiesToBooking = async (
//   bookingId: string,
//   facilities: { id: string; startDate: string; duration: number }[]
// ) => {
//   try {
//     const response = await api.post(
//       `/user/bookings/${bookingId}/add-facilities`,
//       {
//         facilities,
//       }
//     );
//     return handleResponse(response, "Error adding facilities to booking");
//   } catch (error) {
//     handleError(error);
//   }
// };

export const createFacilityPaymentSession = async (
  bookingId: string,
  facilities: { id: string; startDate: string; duration: number }[]
) => {
  try {
    const response = await api.post(
      `/user/bookings/${bookingId}/facility-payment`,
      { facilities }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const checkPaymentStatus = async (sessionId: string) => {
  try {
    const response = await api.get(`/user/payments/check-payment/${sessionId}`);

    return handleResponse(response.data, "Error while checking payment status");
  } catch (error) {
    handleError(error);
  }
};

export const processMonthlyPayment = async (
  bookingId: string,
  month: number
) => {
  try {
    const response = await api.post(
      `/user/bookings/${bookingId}/monthly-payment`,
      { month }
    );
    console.log(response);
    return handleResponse(
      response.data,
      "Error while processing monthly payment"
    );
  } catch (error) {
    handleError(error);
  }
};

import {
  publicAxiosInstance,
  userAxiosInstance,
} from "../axiosInstance/userInstance";
import { HostelFilters, ApiResponse, Hostel } from '@/types/api.types';

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

export const listAllHostels = async (filters?: HostelFilters): Promise<Hostel[] | undefined> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.amenities?.length) queryParams.append('amenities', filters.amenities.join(','));
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    }

    const response = await api.get<ApiResponse<Hostel[]>>(`/user/verified-hostels?${queryParams.toString()}`);
    return handleResponse(response.data.data, "Error in list hostel");
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

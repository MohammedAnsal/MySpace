import {
  userAxiosInstance,
  publicAxiosInstance,
} from "../axiosInstance/userInstance";

const publicApi = publicAxiosInstance;
const privateApi = userAxiosInstance;

const handleResponse = (response: any, message: string) => {
  if (!response) console.error(message);
  return response;
};

const handleError = (error: any) => {
  console.error(error);
  throw error;
};

export const signUpRequest = async (formData: FormData) => {
  try {
    const response = await publicApi.post("/auth/provider/sign-up", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response, "Signup response not received correctly");
  } catch (error) {
    handleError(error);
  }
};

export const signInRequest = async (data: Object) => {
  try {
    const response = await publicApi.post("/auth/provider/sign-in", data);
    return handleResponse(response, "Signin response not received correctly");
  } catch (error) {
    handleError(error);
  }
};

export const forgotPssword = async (email: string) => {
  try {
    const response = await publicApi.post("/auth/provider/forgot-password", {
      email,
    });
    return handleResponse(response, "Forgot-password not recevied correctly");
  } catch (error) {
    handleError(error);
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await publicApi.put("/auth/provider/reset-password", {
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
    const response = await privateApi.post(
      "/auth/provider/google-signIn",
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

export const providerLogout = async () => {
  try {
    const response = await publicApi.post("/auth/provider/logout");
    return handleResponse(response, "Logout response not received correctly");
  } catch (error) {
    handleError(error);
  }
};

export const findProvider = async () => {
  try {
    const response = await privateApi.get("/provider/profile");
    return handleResponse(
      response,
      "FindProvider response not received correctly"
    );
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
    const response = await privateApi.post("/provider/change-password", {
      email,
      currentPassword,
      newPassword,
    });
    return handleResponse(response.data, "Error in changing provider password");
  } catch (error) {
    handleError(error);
  }
};

export const editProfile = async (formData: FormData) => {
  try {
    const response = await privateApi.put("/provider/edit-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response.data, "Error in edit provider profile");
  } catch (error) {
    handleError(error);
  }
};

export const findAllFacilities = async () => {
  try {
    const response = await privateApi.get("/provider/facilities");

    return handleResponse(response.data, "Error in provider get all facility.");
  } catch (error) {
    handleError(error);
  }
};

export const createHostel = async (formData: FormData) => {
  try {
    const response = await privateApi.post(
      "/provider/create-hostel",
      formData
    );
    return handleResponse(response.data, "Error adding hostel");
  } catch (error) {
    handleError(error);
  }
};

export const listAllHostels = async () => {
  try {
    const response = await privateApi.get("/provider/all-hostels");
    return handleResponse(response.data.data, "Error listing hostel");
  } catch (error) {
    handleError(error);
  }
};

export const getHostelById = async (hostelId: string) => {
  try {
    const response = await privateApi.get(`/provider/get-hostel/${hostelId}`);
    return handleResponse(response.data, "Error getting hostel");
  } catch (error) {
    handleError(error);
  }
};

export const updateHostel = async (id: string, formData: FormData) => {
  try {

    const response = await privateApi.put(
      `/provider/edit-hostel/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update hostel");
    }

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteHostel = async (hostelId: string) => {
  try {
    const response = await privateApi.delete(
      `/provider/delete-hostel/${hostelId}`
    );
    return handleResponse(response.data.data, "Error delete hostel");
  } catch (error) {
    handleError(error);
  }
};

export const listProviderBookings = async () => {
  try {
    const response = await privateApi.get("/provider/bookings");

    return handleResponse(
      response.data.data,
      "Error in list provider bookings"
    );
  } catch (error) {
    handleError(error);
  }
};

export const getProviderDashboard = async () => {
  try {
    const response = await privateApi.get("/provider/dashboard");
    return handleResponse(
      response.data.getDashboardData,
      "Error fetching provider dashboard"
    );
  } catch (error) {
    handleError(error);
  }
};

export const getProviderWallet = async () => {
  try {
    const response = await privateApi.get("/wallet/provider-wallet");
    return handleResponse(response.data, "Error fetching provider wallet");
  } catch (error) {
    handleError(error);
    return { success: false, data: null };
  }
};

export const getWalletTransactions = async () => {
  try {
    const response = await privateApi.get("/wallet/transactions");
    return handleResponse(response.data, "Error fetching wallet transactions");
  } catch (error) {
    handleError(error);
    return { success: false, data: [] };
  }
};

export const createMenuItem = async (formData: FormData) => {
  try {
    const response = await privateApi.post(
      "/facility/menu-item/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return handleResponse(response.data, "Error creating menu item");
  } catch (error) {
    handleError(error);
  }
};

export const getAllMenuItems = async () => {
  try {
    const response = await privateApi.get("/facility/menu-item/all");
    return handleResponse(response.data, "Error fetching menu items");
  } catch (error) {
    handleError(error);
  }
};

export const getMenuItemsByCategory = async (category: string) => {
  try {
    const response = await privateApi.get(
      `/facility/menu-item/category/${category}`
    );
    return handleResponse(
      response.data,
      "Error fetching menu items by category"
    );
  } catch (error) {
    handleError(error);
  }
};

export const updateMenuItem = async (id: string, formData: FormData) => {
  try {
    const response = await privateApi.put(
      `/facility/menu-item/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return handleResponse(response.data, "Error updating menu item");
  } catch (error) {
    handleError(error);
  }
};

export const deleteMenuItem = async (id: string) => {
  try {
    const response = await privateApi.delete(`/facility/menu-item/${id}`);
    return handleResponse(response.data, "Error deleting menu item");
  } catch (error) {
    handleError(error);
  }
};

// export const createFoodMenu = async (
//   providerId: string,
//   facilityId: string
// ) => {
//   try {
//     const response = await privateApi.post("/facility/food-menu/create", {
//       providerId,
//       facilityId,
//     });
//     return handleResponse(response.data, "Error creating food menu");
//   } catch (error) {
//     handleError(error);
//   }
// };

export const getFoodMenu = async (facilityId: string, hostelId: string) => {
  try {
    const response = await privateApi.get(
      `/facility/food-menu/${facilityId}/${hostelId}`
    );
    return handleResponse(response.data, "Error fetching food menu");
  } catch (error) {
    handleError(error);
  }
};

export const updateFoodMenu = async (id: string, menuData: any) => {
  try {
    const response = await privateApi.put(
      `/facility/food-menu/${id}`,
      menuData
    );
    return handleResponse(response.data, "Error updating food menu");
  } catch (error) {
    handleError(error);
  }
};

export const deleteFoodMenu = async (
  id: string,
  foodMenuId: string,
  day: string,
  mealType: "morning" | "noon" | "night"
) => {
  try {
    const response = await privateApi.delete(`/facility/food-menu/${id}`, {
      data: { foodMenuId, day, mealType },
    });
    return handleResponse(response.data, "Error deleting food menu");
  } catch (error) {
    handleError(error);
  }
};

export const addSingleDayMenu = async (
  facilityId: string,
  hostelId: string,
  day: string,
  meals: {
    morning?: string[];
    noon?: string[];
    night?: string[];
  }
) => {
  try {
    const response = await privateApi.post("/facility/food-menu/day", {
      facilityId,
      hostelId,
      day,
      meals,
    });
    return handleResponse(response.data, "Error adding day menu");
  } catch (error) {
    handleError(error);
  }
};

export const getProviderWashingRequests = async () => {
  try {
    const response = await privateApi.get(
      "/facility/washing/provider/requests"
    );
    return handleResponse(response.data, "Error fetching washing requests");
  } catch (error) {
    handleError(error);
    return { success: false, data: [] };
  }
};

export const updateWashingRequestStatus = async (
  id: string,
  status: string
) => {
  try {
    const response = await privateApi.put(`/facility/washing/${id}/status`, {
      status,
    });
    return handleResponse(
      response.data,
      "Error updating washing request status"
    );
  } catch (error) {
    handleError(error);
    return { success: false, message: "Failed to update request status" };
  }
};

export const getProviderCleaningRequests = async () => {
  try {
    const response = await privateApi.get(
      "/facility/cleaning/provider/requests"
    );
    return handleResponse(response.data, "Error fetching cleaning requests");
  } catch (error) {
    handleError(error);
    return { success: false, data: [] };
  }
};

export const updateCleaningRequestStatus = async (
  id: string,
  status: string
) => {
  try {
    const response = await privateApi.put(`/facility/cleaning/${id}/status`, {
      status,
    });
    return handleResponse(
      response.data,
      "Error updating cleaning request status"
    );
  } catch (error) {
    handleError(error);
    return { success: false, message: "Failed to update request status" };
  }
};

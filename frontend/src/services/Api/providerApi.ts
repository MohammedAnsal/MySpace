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

export const signUpRequest = async (formData: Object) => {
  try {
    const response = await publicApi.post("/auth/provider/sign-up", formData);
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

export const createFacility = async (facilityData: any) => {
  try {
    const response = await privateApi.post(
      "/provider/add-facility",
      facilityData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return handleResponse(response.data, "Error in provider add facility.");
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

export const updateFacilityStatus = async (
  facilityId: string,
  status: boolean
) => {
  try {
    const response = await privateApi.put("/provider/facility/status", {
      facilityId,
      status,
    });
    return handleResponse(response.data, "Error updating facility status");
  } catch (error) {
    handleError(error);
  }
};

export const deleteFacility = async (facilityId: string) => {
  try {
    const response = await privateApi.delete(
      `/provider/facility/${facilityId}`
    );
    return handleResponse(response.data, "Error deleting facility");
  } catch (error) {
    handleError(error);
  }
};

export const createHostel = async (formData: FormData) => {
  try {
    const response = await privateApi.post(
      "/provider/create-hostel",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    // Debug log
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

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
    console.log(response, "from provider api");

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

import {
  adminAxiosInstance,
  publicAxiosInstance,
} from "../../axiosInstance/adminInstance";

const public_api = publicAxiosInstance;
const private_api = adminAxiosInstance;

const handleResponse = (response: any, message: string) => {
  if (!response) console.error(message);
  return response;
};

const handleError = (error: any) => {
  console.error(error);
  throw error;
};

export const signIn_Request = async (adminData: Object) => {
  const response = await public_api.post("/auth/admin/sign-in", adminData);

  if (!response) console.log("returning is not getting correctly");

  return response;
};

export const forgotPssword = async (email: string) => {
  try {

    const response = await public_api.post("/auth/admin/forgot-password", {
      email,
    });
    return handleResponse(response, "Forgot-password not recevied correctly");
  } catch (error) {
    handleError(error);
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await public_api.put("/auth/admin/reset-password", {
      email,
      newPassword,
    });
    return handleResponse(response, "Error in reset password request");
  } catch (error) {
    handleError(error);
  }
};

export const getAllUsers = async () => {
  const response = await private_api.get("/admin/users");

  if (!response) console.log("Somthing Went Wrong in getUser'sss");

  return response;
};

export const getAllProviders = async () => {
  const response = await private_api.get("/admin/providers");

  if (!response) console.log("Failed Getting Providerss");

  return response;
};

export const updateStatus = async (email: string) => {
  const response = await private_api.put("/admin/updateUser", { email });

  if (!response) console.log("Somthing Went Wrong in updateUser");

  return response;
};

export const admin_logout = async () => {
  const response = await public_api.post("/auth/admin/logout");

  if (!response) console.log("Error in admin logout");

  return response;
};

export const verifyHostel = async (
  hostelId: string,
  reason: string,
  isVerified: boolean,
  isRejected: boolean
) => {
  try {
    const response = await private_api.put("/admin/verify-hostel", {
      hostelId,
      reason,
      isVerified,
      isRejected,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUnverifiedHostels = async () => {
  try {
    const response = await private_api.get("/admin/unverified-hostels");

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getVerifiedHostels = async () => {
  try {
    const response = await private_api.get("/admin/verified-hostels");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getHostelById = async (hostelId: string) => {
  try {
    const response = await private_api.get(`/admin/hostel/${hostelId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createFacility = async (facilityData: any) => {
  try {
    const response = await private_api.post(
      "/admin/add-facility",
      facilityData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return handleResponse(response.data, "Error in admin add facility.");
  } catch (error) {
    handleError(error);
  }
};

export const findAllFacilities = async () => {
  try {
    const response = await private_api.get("/admin/facilities");

    return handleResponse(response.data, "Error in admin get all facility.");
  } catch (error) {
    handleError(error);
  }
};

export const updateFacilityStatus = async (
  facilityId: string,
  status: boolean
) => {
  try {
    const response = await private_api.put("/admin/facility/status", {
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
    const response = await private_api.delete(`/admin/facility/${facilityId}`);
    return handleResponse(response.data, "Error deleting facility");
  } catch (error) {
    handleError(error);
  }
};

export const listAdminBookings = async () => {
  try {
    const response = await private_api.get("/admin/bookings");
    console.log(response, "from admin api");

    return handleResponse(response.data.data, "Error in list admin bookings");
  } catch (error) {
    handleError(error);
  }
};

export const getAdminDashboard = async () => {
  try {
    const response = await private_api.get("/admin/dashboard");
    console.log(response, "from admin api");

    return handleResponse(
      response.data.getDashboardData,
      "Error in admin dashboard"
    );
  } catch (error) {
    handleError(error);
  }
};

export const getAdminWallet = async () => {
  try {
    const response = await private_api.get("/wallet/admin-wallet");
    return handleResponse(response.data, "Error fetching admin wallet");
  } catch (error) {
    handleError(error);
  }
};

export const getAdminTransactions = async () => {
  try {
    const response = await private_api.get("/wallet/transactions");
    return handleResponse(response.data, "Error fetching wallet transactions");
  } catch (error) {
    handleError(error);
  }
};

export const processPayouts = async (payoutData: any) => {
  try {
    const response = await private_api.post(
      "/wallet/process-payout",
      payoutData
    );
    return handleResponse(response.data, "Error processing payout");
  } catch (error) {
    handleError(error);
  }
};

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

export const verifyHostel = async (hostelId: string, isVerified: boolean) => {
  try {
    const response = await private_api.put("/admin/verify-hostel", {
      hostelId,
      isVerified,
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

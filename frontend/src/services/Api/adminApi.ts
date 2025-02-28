import {
  adminAxiosInstance,
  publicAxiosInstance,
} from "../axiosInstance/adminInstance";

const public_api = publicAxiosInstance;
const private_api = adminAxiosInstance;

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

export const logout = async () => {
  const response = await private_api.post("/admin/logout");

  if (!response) console.log("Error in admin logout");

  return response;
};

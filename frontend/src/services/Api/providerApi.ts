import {
  userAxiosInstance,
  publicAxiosInstance,
} from "../axiosInstance/userInstance";

const public_api = publicAxiosInstance;
const api = userAxiosInstance;

export const signUp_Request = async (formData: Object) => {
  const response = await public_api.post("/auth/provider/sign-up", formData);

  if (!response) console.log("returning is not getting correctly");
  return response;
};

export const signIn_Request = async (data: Object) => {
  const response = await public_api.post("/auth/provider/sign-in", data);

  if (!response) console.log("returning is not getting correctly");
  return response;
};

export const provider_Logout = async () => {
  const response = await api.post("/auth/logout");

  if (!response) console.log("Error in logout");
  return response;
};

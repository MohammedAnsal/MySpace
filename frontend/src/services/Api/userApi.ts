import {
  publicAxiosInstance,
  userAxiosInstance,
} from "../axiosInstance/userInstance";

const api = userAxiosInstance;
const public_api = publicAxiosInstance;

export const signUp_Request = async (formData: object) => {
  // console.log(formData, "body Dataaa");

  const response = await public_api.post("/auth/sign-up", formData);
  console.log(response, "get Responsee");

  if (!response) console.log("returning is not gettin correctly");

  return response;
};

export const verify_Otp = async (email: string, otp: string) => {
  const response = await public_api.post("/auth/verify-otp", { email, otp });

  console.log(response, "get Responsee otppp");
  if (!response) console.log("returning is not gettin correctly");

  return response;
};

export const signIn_Requset = async (formData: object) => {
  console.log(formData, "form Dataaaa");

  const response = await userAxiosInstance.post("/auth/sign-in", formData);

  console.log(response, "get signIn Responsee");

  if (!response) console.log("returning is not gettin correctly");

  return response;
};

export const resend_Otp = async (email: string) => {
  console.log(email, "from re-senddd");

  const response = await userAxiosInstance.post("/auth/resend-otp", { email });

  console.log(response, "get Responsee otppp");
  if (!response) console.log("returning is not gettin correctly");

  return response;
};

export const user_Logout = async () => {
  const response = await api.post("/user/logout");

  if (!response) console.log("Error in logout");

  return response;
};

export const forgot_Password = async (email: string) => {
  const response = await public_api.post("/auth/forgot-password", { email });

  if (!response) console.log("Error in forgot password");

  return response;
};

export const reset_Password = async (
  email: string,

  newPassword: string
) => {
  console.log(email);

  console.log(newPassword);
  const response = await public_api.put("/auth/reset-password", {
    email,

    newPassword,
  });

  if (!response) console.log("Error in re-setPassword");

  return response;
};

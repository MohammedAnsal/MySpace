import {
  providerAxiosInstance,
  publicAxiosInstance,
} from "../axiosInstance/providerInstance";

const public_api = publicAxiosInstance;
// const provider_api = providerAxiosInstance

export const signUp_Request = async (formData: Object) => {
  const response = await public_api.post("/auth/provider/sign-up", formData);
  if (!response) console.log("returning is not getting correctly");
  return response;
};

export const signIn_Request = async (data: Object) => {
  console.log(data, "gettit");
  const response = await public_api.post("/auth/provider/sign-in", data);

  console.log(response, "from apiiii");

  if (!response) console.log("returning is not getting correctly");

  return response;
};

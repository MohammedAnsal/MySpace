import axios from "axios";
import { publicAxiosInstance } from "../axiosInstance/adminInstance";

const public_api = publicAxiosInstance;

export const signIn_Request = async (adminData: Object) => {
  const response = await public_api.post("/auth/admin/sign-in", adminData);

  if (!response) console.log("returning is not getting correctly");

  return response;
};

export const getAllUsers = async () => {
  const response = await public_api.get("/admin/users");

  console.log(response,'l');
  

  if (!response) console.log("Somthing Went Wrong in getUser'sss");

  return response;
};

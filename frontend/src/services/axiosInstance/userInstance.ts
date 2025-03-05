import { logout } from "@/redux/slice/userSlice";
import store from "@/redux/store/store";
import axios from "axios";
import { a } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_USER_BASE_URL;

export const userAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
}); //  User Axios Instence

export const publicAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
}); //  Public Axios Instence

const controllerMap = new Map();

//  For Request

userAxiosInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("access-token");
  console.log(token, "this is is in userInstance");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("===========", config.headers.authorization);
  }

  if (!config.signal) {
    const controller = new AbortController();
    config.signal = controller.signal;
    controllerMap.set(config.url, controller);
  }

  return config;
});

//  For Response

userAxiosInstance.interceptors.response.use(
  (response) => {
    controllerMap.delete(response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest.url;

    if (error.response) {

      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || "An error occured";
        const customError = new Error(errorMsg);
        return Promise.reject(customError);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await getNewAccessToken();
          localStorage.setItem("access-token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return userAxiosInstance(originalRequest);
        } catch (err) {
          // toast.error("Session expired");
          // store.dispatch(logout());
          return Promise.reject(err);
        }
        
      }

      if (error.response.status >= 500) {
        toast.error("Server error, please try again later.");
      }

      if (
        error.response.status >= 400 &&
        error.response.status < 500 &&
        error.response.status !== 401
      ) {
        toast.error(`${error.response.data.error || "An error occurred"}`);
      }
    } else if (error.request) {
      toast.error("Network error, please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }

    controllerMap.delete(url);
    return Promise.reject(error);
  }
);

//  For New AccessToken

async function getNewAccessToken() {
  const response = await axios.get(`${API_URL}/auth/refresh-token`, {
    withCredentials: true,
  });
  console.log(response, "getRefreshhh");
  return response.data.token;
}

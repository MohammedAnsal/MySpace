import { logout } from "@/redux/slice/userSlice";
import store from "@/redux/store/store";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_USER_BASE_URL;

export const userAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
}); //  User Axios Instance

export const publicAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
}); //  Public Axios Instance

const controllerMap = new Map();

//  **Request Interceptor**
userAxiosInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("access-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!config.signal) {
    const controller = new AbortController();
    config.signal = controller.signal;
    controllerMap.set(config.url, controller);
  }

  return config;
});

// **Response Interceptor**
userAxiosInstance.interceptors.response.use(
  (response) => {
    controllerMap.delete(response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest.url;

    if (error.response) {
      const status = error.response.status;

      // **Handle Unauthorized (401) - Token Expired**
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite retry loop

        try {
          const newAccessToken = await getNewAccessToken();
          console.log(newAccessToken);
          if (newAccessToken) {
            localStorage.setItem("access-token", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return userAxiosInstance(originalRequest);
          } else {
            throw new Error("Failed to refresh token");
          }
        } catch (err) {
          toast.error("Session expired, please log in again.");
          store.dispatch(logout());
          localStorage.removeItem("access-token");
          return Promise.reject(err);
        }
      }

      // **Handle Forbidden (403) - Blocked User**
      if (status === 403) {
        toast.error("Your account has been blocked. Logging out...");
        store.dispatch(logout());
        localStorage.removeItem("access-token");
        return Promise.reject(new Error("User blocked by admin"));
      }

      // **Handle Server Errors (5xx)**
      if (status >= 500) {
        toast.error("Server error, please try again later.");
      }

      // **Handle Other Client Errors (4xx)**
      if (status >= 400 && status < 500 && status !== 401) {
        toast.error(error.response.data.message || "An error occured");
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

// **Function to Get a New Access Token**
async function getNewAccessToken() {
  try {
    const response = await axios.get(`${API_URL}/auth/refresh-token`, {
      withCredentials: true,
    });

    return response.data.token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

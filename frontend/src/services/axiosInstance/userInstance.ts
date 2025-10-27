import { logout } from "@/redux/slice/userSlice";
import store from "@/redux/store/store";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_USER_BASE_URL;

export const userAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const publicAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const controllerMap = new Map();

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

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await getNewAccessToken();
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

      if (status === 403) {
        toast.error("Your account has been blocked. Logging out...");
        store.dispatch(logout());
        localStorage.removeItem("access-token");
        return Promise.reject(new Error("User blocked by admin"));
      }

      if (status >= 500) {
        toast.error("Server error, please try again later.");
      }

      if (status > 400 && status < 500 && status !== 401) {
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

async function getNewAccessToken() {
  try {
    const response = await axios.post(
      `${API_URL}/auth/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );

    return response.data.token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

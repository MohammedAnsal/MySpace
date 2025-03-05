import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_USER_BASE_URL;

export const publicAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const adminAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const controllerMap = new Map();

//  For Requset

adminAxiosInstance.interceptors.request.use(async (config) => {
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

//  For Response

adminAxiosInstance.interceptors.response.use(
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
          localStorage.setItem("admin-access-token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return adminAxiosInstance(originalRequest);
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
  const response = await axios.get(`${API_URL}/auth/admin-refresh-token`, {
    withCredentials: true,
  });
  console.log(response, "getRefreshhh");
  return response.data.token;
}

import axios from "axios";

export const axiosInstance = (baseURL: string) => {
  try {
    const instance = axios.create({
      baseURL,
      withCredentials: true,
    });

    // Request Interceptor

    instance.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return instance;
  } catch (error: any) {
    console.log(error.message);
  }
};

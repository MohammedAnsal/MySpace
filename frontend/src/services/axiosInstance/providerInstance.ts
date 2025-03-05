// import axios from "axios";

// const API_URL = import.meta.env.VITE_USER_BASE_URL;

// export const providerAxiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// export const publicAxiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// // const controllerMap = new Map();

// // //  For Request

// // providerAxiosInstance.interceptors.request.use(async (config) => {
// //   const token = localStorage.getItem("access-token");

// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }

// //   if (!config.signal) {
// //     const controller = new AbortController();
// //     config.signal = controller.signal;
// //     controllerMap.set(config.url, controller);
// //   }
// //   return config;
// // });


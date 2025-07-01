import { userAxiosInstance } from "../axiosInstance/userInstance";

const API_BASE_URL = "https://api.my-space.shop/notification";

export const createNotification = async (data: any) => {
  try {
    const response = await userAxiosInstance.post(API_BASE_URL, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create notification"
    );
  }
};

export const getNotificationById = async (id: string) => {
  try {
    const response = await userAxiosInstance.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch notification"
    );
  }
};

export const updateNotification = async (id: string, data: any) => {
  try {
    const response = await userAxiosInstance.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update notification"
    );
  }
};

export const deleteNotification = async (id: string) => {
  try {
    await userAxiosInstance.delete(`${API_BASE_URL}/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete notification"
    );
  }
};

export const getNotificationsByRecipient = async (recipientId: string) => {
  try {
    const response = await userAxiosInstance.get(
      `${API_BASE_URL}/recipient/${recipientId}` 
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch notifications"
    );
  }
};

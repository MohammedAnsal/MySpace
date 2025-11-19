import { userAxiosInstance } from "../axiosInstance/userInstance";
import { AxiosError } from "axios";
import {
  INotification,
  CreateNotificationDTO,
  UpdateNotificationDTO,
} from "../../types/notification";

const API_BASE_URL = "https://api.my-space.shop/notification";
// const API_BASE_URL = "http://localhost:7001/notification";

export const createNotification = async (
  data: CreateNotificationDTO
): Promise<INotification> => {
  try {
    const response = await userAxiosInstance.post(API_BASE_URL, data);
    return response.data as INotification;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(
      err.response?.data?.message || "Failed to create notification"
    );
  }
};

export const getNotificationById = async (
  id: string
): Promise<INotification> => {
  try {
    const response = await userAxiosInstance.get(`${API_BASE_URL}/${id}`);
    return response.data as INotification;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(
      err.response?.data?.message || "Failed to fetch notification"
    );
  }
};

export const updateNotification = async (
  id: string,
  data: UpdateNotificationDTO
): Promise<INotification> => {
  try {
    const response = await userAxiosInstance.patch(
      `${API_BASE_URL}/${id}`,
      data
    );
    return response.data as INotification;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(
      err.response?.data?.message || "Failed to update notification"
    );
  }
};

export const deleteNotification = async (id: string): Promise<void> => {
  try {
    await userAxiosInstance.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(
      err.response?.data?.message || "Failed to delete notification"
    );
  }
};

export const getNotificationsByRecipient = async (recipientId: string) => {
  try {
    const response = await userAxiosInstance.get(
      `${API_BASE_URL}/recipient/${recipientId}`
    );
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    throw new Error(
      err.response?.data?.message || "Failed to fetch notifications"
    );
  }
};

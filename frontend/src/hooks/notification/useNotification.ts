import { useState } from "react";
import {
  createNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getNotificationsByRecipient,
} from "../../services/Api/notificationApi";

export const useNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (requestFn: (...args: any[]) => Promise<any>, ...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestFn(...args);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setLoading(false);
      throw errorMessage;
    }
  };

  return {
    loading,
    error,
    createNotification: (data: any) => handleRequest(createNotification, data),
    getNotificationById: (id: string) => handleRequest(getNotificationById, id),
    updateNotification: (id: string, data: any) => handleRequest(updateNotification, id, data),
    deleteNotification: (id: string) => handleRequest(deleteNotification, id),
    getNotificationsByRecipient: (recipientId: string) =>
      handleRequest(getNotificationsByRecipient, recipientId),
  };
};

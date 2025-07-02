import React, { createContext, useContext, useEffect, useState } from "react";
import socketService from "../services/socket/socket.service";
import { INotification } from "../types/notification";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { getNotificationsByRecipient } from "@/services/Api/notificationApi";

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { userId } = useSelector((state: RootState) => state.user);

  // Keep track of notifications we've already received via socket
  const [receivedSocketNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      if (userId) {
        try {
          const response = await getNotificationsByRecipient(userId);

          // Filter out notifications we've already received via socket
          const filteredNotifications = response.filter(
            (notification: INotification) =>
              !receivedSocketNotifications.has(notification._id)
          );
          setNotifications(filteredNotifications);
          setUnreadCount(
            filteredNotifications.filter((n: { isRead: boolean }) => !n.isRead)
              .length
          );
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };
    fetchInitialNotifications();
  }, [userId, receivedSocketNotifications]);

  useEffect(() => {
    // Listen for new notifications
    const handleNewNotification = (notification: INotification) => {
      receivedSocketNotifications.add(notification._id);

      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === notification._id);
        if (exists) {
          return prev;
        }
        return [notification, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
    };

    // Listen for notification count updates
    const handleNotificationCountUpdate = (data: { count: number }) => {
      setUnreadCount(data.count);
    };

    // Add socket listeners
    socketService.addEventListener("new_notification", handleNewNotification);
    socketService.addEventListener(
      "notification_count_update",
      handleNotificationCountUpdate
    );

    return () => {
      // Clean up listeners
      socketService.removeEventListener(
        "new_notification",
        handleNewNotification
      );
      socketService.removeEventListener(
        "notification_count_update",
        handleNotificationCountUpdate
      );
    };
  }, [receivedSocketNotifications]);

  useEffect(() => {
    // Connect to socket when provider mounts
    socketService.connect();

    return () => {
      // Disconnect when provider unmounts
      socketService.disconnect();
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      socketService.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      socketService.deleteNotification(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      socketService.markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        deleteNotification,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

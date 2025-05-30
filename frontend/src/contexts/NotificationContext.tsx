import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../services/socket/socket.service';
import { INotification } from '../types/notification';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { getNotificationsByRecipient } from '@/services/Api/notificationApi';

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const { userId } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      if (userId) {
        try {
          const response = await getNotificationsByRecipient(userId);
          setNotifications(response.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };
    fetchInitialNotifications();
  }, [userId]);

  useEffect(() => {
    // Listen for new notifications
    const handleNewNotification = (notification: INotification) => {
      console.log('New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
    };

    // Listen for notification read status
    const handleNotificationRead = ({ notificationId }: { notificationId: string }) => {
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    };

    // Add socket listeners
    socketService.addEventListener('new_notification', handleNewNotification);
    socketService.addEventListener('notification_read', handleNotificationRead);

    // Add new listeners for delete and mark all as read
    const handleNotificationDeleted = ({ notificationId }: { notificationId: string }) => {
      setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
    };

    const handleAllNotificationsRead = () => {
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    };

    socketService.addEventListener('notification_deleted', handleNotificationDeleted);
    socketService.addEventListener('all_notifications_read', handleAllNotificationsRead);

    return () => {
      // Clean up listeners
      socketService.removeEventListener('new_notification', handleNewNotification);
      socketService.removeEventListener('notification_read', handleNotificationRead);
      socketService.removeEventListener('notification_deleted', handleNotificationDeleted);
      socketService.removeEventListener('all_notifications_read', handleAllNotificationsRead);
    };
  }, []);

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
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      socketService.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      socketService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 
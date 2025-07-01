import { INotification } from "../../../models/notification/notification.model";

export interface INotificationService {
  createNotification(
    notificationData: Partial<INotification>
  ): Promise<INotification>;
  getNotificationById(id: string): Promise<INotification | null>;
  updateNotification(
    id: string,
    updateData: Partial<INotification>
  ): Promise<INotification | null>;
  deleteNotification(id: string): Promise<void>;
  getNotificationsByRecipient(recipientId: string): Promise<INotification[]>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}

import {
  CreateNotificationDTO,
  UpdateNotificationDTO,
  NotificationResponseDTO,
  NotificationListResponseDTO,
} from "../../../dtos/notification/notification.dto";

export interface INotificationService {
  createNotification(
    notificationData: CreateNotificationDTO
  ): Promise<NotificationResponseDTO>;

  getNotificationById(id: string): Promise<NotificationResponseDTO | null>;

  updateNotification(
    id: string,
    updateData: UpdateNotificationDTO
  ): Promise<NotificationResponseDTO | null>;

  deleteNotification(id: string): Promise<void>;

  getNotificationsByRecipient(
    recipientId: string
  ): Promise<NotificationListResponseDTO>;

  getUnreadCount(userId: string): Promise<number>;
}

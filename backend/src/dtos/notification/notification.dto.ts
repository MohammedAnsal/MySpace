import { Types } from "mongoose";

// Base notification type enum
export type NotificationType =
  | "message"
  | "hostel"
  | "rent_reminder"
  | "booking"
  | "refund";

// DTO for creating a new notification
export interface CreateNotificationDTO {
  recipient: string | Types.ObjectId;
  sender?: string | Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
}

// DTO for updating a notification
export interface UpdateNotificationDTO {
  title?: string;
  message?: string;
  isRead?: boolean;
  isDeleted?: boolean;
}

// DTO for notification response (what gets sent to client)
export interface NotificationResponseDTO {
  _id: string;
  recipient: string;
  sender?: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// DTO for notification list response
export interface NotificationListResponseDTO {
  notifications: NotificationResponseDTO[];
  totalCount: number;
  unreadCount: number;
}

// Utility function to map model to response DTO
export function mapToNotificationResponseDTO(
  notification: any
): NotificationResponseDTO {
  return {
    _id: notification._id.toString(),
    recipient: notification.recipient.toString(),
    sender: notification.sender?.toString(),
    title: notification.title,
    message: notification.message,
    type: notification.type,
    isRead: notification.isRead,
    isDeleted: notification.isDeleted,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
  };
}

// Utility function to map multiple notifications
export function mapToNotificationListResponseDTO(
  notifications: any[],
  totalCount: number,
  unreadCount: number
): NotificationListResponseDTO {
  return {
    notifications: notifications.map(mapToNotificationResponseDTO),
    totalCount,
    unreadCount,
  };
}

import { NotificationRepository } from "../../../repositories/implementations/notification/notification.repository";
import { AppError } from "../../../utils/error";
import { HttpStatus, responseMessage } from "../../../enums/http.status";
import Container, { Service } from "typedi";
import { INotificationService } from "../../../services/interface/notification/notification.service.interface";
import {
  CreateNotificationDTO,
  UpdateNotificationDTO,
  NotificationResponseDTO,
  NotificationListResponseDTO,
  mapToNotificationResponseDTO,
  mapToNotificationListResponseDTO,
} from "../../../dtos/notification/notification.dto";

@Service()
export class NotificationService implements INotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  // Create notification
  async createNotification(
    notificationData: CreateNotificationDTO
  ): Promise<NotificationResponseDTO> {
    try {
      const notification = await this.notificationRepo.create(notificationData);
      return mapToNotificationResponseDTO(notification);
    } catch (error) {
      console.log(error);
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Get single notification
  async getNotificationById(
    id: string
  ): Promise<NotificationResponseDTO | null> {
    try {
      const notification = await this.notificationRepo.findById(id);
      if (!notification) {
        throw new AppError(responseMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return mapToNotificationResponseDTO(notification);
    } catch (error) {
      console.log(error);
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Update notification
  async updateNotification(
    id: string,
    updateData: UpdateNotificationDTO
  ): Promise<NotificationResponseDTO | null> {
    try {
      const notification = await this.notificationRepo.update(id, updateData);
      if (!notification) {
        throw new AppError(responseMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return mapToNotificationResponseDTO(notification);
    } catch (error) {
      console.log(error);
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Delete notification
  async deleteNotification(id: string): Promise<void> {
    try {
      const notification = await this.notificationRepo.findById(id);
      if (!notification) {
        throw new AppError(responseMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      await this.notificationRepo.delete(id);
    } catch (error) {
      console.log(error);
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Get notifications by recipient
  async getNotificationsByRecipient(
    recipientId: string
  ): Promise<NotificationListResponseDTO> {
    try {
      const notifications = await this.notificationRepo.findAllByRecipient(
        recipientId
      );
      const unreadCount = await this.notificationRepo.countUnread(recipientId);

      return mapToNotificationListResponseDTO(
        notifications,
        notifications.length,
        unreadCount
      );
    } catch (error) {
      console.log(error);
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      await this.notificationRepo.markAllAsRead(userId);
    } catch (error) {
      console.log(error);
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepo.countUnread(userId);
  }
}

export const notificationService = Container.get(NotificationService);

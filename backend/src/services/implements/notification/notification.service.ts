import { NotificationRepository } from "../../../repositories/implementations/notification/notification.repository";
import { INotification } from "../../../models/notification/notification.model";
import { AppError } from "../../../utils/error";
import { HttpStatus, responseMessage } from "../../../enums/http.status";
import Container, { Service } from "typedi";
import { INotificationService } from "../../../services/interface/notification/notification.service.interface";

@Service()
export class NotificationService implements INotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  //  Create notification :-

  async createNotification(
    notificationData: Partial<INotification>
  ): Promise<INotification> {
    try {
      return await this.notificationRepo.create(notificationData);
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get single notification :-

  async getNotificationById(id: string): Promise<INotification | null> {
    try {
      const notification = await this.notificationRepo.findById(id);
      if (!notification) {
        throw new AppError(responseMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return notification;
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Update notification :-

  async updateNotification(
    id: string,
    updateData: Partial<INotification>
  ): Promise<INotification | null> {
    try {
      const notification = await this.notificationRepo.update(id, updateData);
      if (!notification) {
        throw new AppError(responseMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return notification;
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  //  Delete notification :-

  async deleteNotification(id: string): Promise<void> {
    try {
      const notification = await this.notificationRepo.findById(id);
      if (!notification) {
        throw new AppError(responseMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      await this.notificationRepo.delete(id);
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get notification by recipient :-

  async getNotificationsByRecipient(
    recipientId: string
  ): Promise<INotification[]> {
    try {
      return await this.notificationRepo.findAllByRecipient(recipientId);
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Mark all seen notification :-

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      await this.notificationRepo.markAllAsRead(userId);
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Gett all un-read count notification :-

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepo.countUnread(userId);
  }
}

export const notificationService = Container.get(NotificationService);

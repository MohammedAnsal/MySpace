import { NotificationRepository } from "../../../repositories/implementations/notification/notification.repository";
import { INotification } from "../../../models/notification/notification.model";
import { AppError } from "../../../utils/error";
import { HttpStatus, responseMessage } from "../../../enums/http.status";
import Container, { Service } from "typedi";

@Service()
export class NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  async createNotification(
    notificationData: Partial<INotification>
  ): Promise<INotification> {
    try {
      return await this.repository.create(notificationData);
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getNotificationById(id: string): Promise<INotification | null> {
    try {
      const notification = await this.repository.findById(id);
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

  async updateNotification(
    id: string,
    updateData: Partial<INotification>
  ): Promise<INotification | null> {
    try {
      const notification = await this.repository.update(id, updateData);
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

  async deleteNotification(id: string): Promise<void> {
    try {
      const notification = await this.repository.findById(id);
      if (!notification) {
        throw new AppError(responseMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      await this.repository.delete(id);
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getNotificationsByRecipient(
    recipientId: string
  ): Promise<INotification[]> {
    try {
      return await this.repository.findAllByRecipient(recipientId);
    } catch (error) {
      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const notificationService = Container.get(NotificationService);

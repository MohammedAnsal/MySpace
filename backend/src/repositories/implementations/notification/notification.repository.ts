import Container, { Service } from "typedi";
import { INotification } from "../../../models/notification/notification.model";
import { Notification } from "../../../models/notification/notification.model";
import { AppError } from "../../../utils/error";
import { INotificationRepository } from "../../interfaces/notification/notification.Irepository";
import { HttpStatus } from "../../../enums/http.status";
import {
  CreateNotificationDTO,
  UpdateNotificationDTO,
} from "../../../dtos/notification/notification.dto";
import { Types } from "mongoose";

@Service()
export class NotificationRepository implements INotificationRepository {
  // Create notification
  async create(
    notificationData: CreateNotificationDTO
  ): Promise<INotification> {
    try {
      // Convert string IDs to ObjectId if needed
      const dataToCreate = {
        ...notificationData,
        recipient: new Types.ObjectId(notificationData.recipient),
        sender: notificationData.sender
          ? new Types.ObjectId(notificationData.sender)
          : undefined,
      };

      const notification = await Notification.create(dataToCreate);
      return notification;
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Failed to create notification",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Find single notification by ID
  async findById(id: string): Promise<INotification | null> {
    try {
      return await Notification.findById(id).exec();
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Failed to fetch notification",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Update notification
  async update(
    id: string,
    updateData: UpdateNotificationDTO
  ): Promise<INotification | null> {
    try {
      return await Notification.findByIdAndUpdate(id, updateData, {
        new: true,
      }).exec();
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Failed to update notification",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Delete notification
  async delete(id: string): Promise<void> {
    try {
      await Notification.findByIdAndDelete(id).exec();
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Failed to delete notification",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Find all notifications by recipient
  async findAllByRecipient(recipientId: string): Promise<INotification[]> {
    try {
      return await Notification.find({
        recipient: recipientId,
        isDeleted: false,
      }).exec();
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Failed to fetch notifications",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    try {
      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { $set: { isRead: true } }
      );
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Failed to mark all notifications as read",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Count unread notifications
  async countUnread(userId: string): Promise<number> {
    return await Notification.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: false,
    });
  }
}

export const notificationRepository = Container.get(NotificationRepository);

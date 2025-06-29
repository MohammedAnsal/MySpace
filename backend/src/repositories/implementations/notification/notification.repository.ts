import Container, { Service } from "typedi";
import { INotification } from "../../../models/notification/notification.model";
import { Notification } from "../../../models/notification/notification.model";
import { AppError } from "../../../utils/error";
import { INotificationRepository } from "../../interfaces/notification/notification.Irepository";
import { HttpStatus } from "../../../enums/http.status";
@Service()
export class NotificationRepository implements INotificationRepository {
  //  For create notification :-

  async create(
    notificationData: Partial<INotification>
  ): Promise<INotification> {
    try {
      const notification = await Notification.create(notificationData);
      return notification;
    } catch (error) {
      throw new AppError(
        "Failed to create notification",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For find singe notification byId :-

  async findById(id: string): Promise<INotification | null> {
    try {
      return await Notification.findById(id).exec();
    } catch (error) {
      throw new AppError(
        "Failed to fetch notification",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For update notification status :-

  async update(
    id: string,
    updateData: Partial<INotification>
  ): Promise<INotification | null> {
    try {
      return await Notification.findByIdAndUpdate(id, updateData, {
        new: true,
      }).exec();
    } catch (error) {
      throw new AppError(
        "Failed to update notification",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For delete notification :-

  async delete(id: string): Promise<void> {
    try {
      await Notification.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new AppError(
        "Failed to delete notification",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For find all notification's :-

  async findAllByRecipient(recipientId: string): Promise<INotification[]> {
    try {
      return await Notification.find({
        recipient: recipientId,
        isDeleted: false,
      }).exec();
    } catch (error) {
      throw new AppError(
        "Failed to fetch notifications",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For markAll notification's :-

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { $set: { isRead: true } }
      );
    } catch (error) {
      throw new AppError(
        "Failed to mark all notifications as read",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For un-read notification count :-

  async countUnread(userId: string): Promise<number> {
    return await Notification.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: false,
    });
  }
}

export const notificationRepository = Container.get(NotificationRepository);

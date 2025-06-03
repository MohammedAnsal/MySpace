import Container, { Service } from "typedi";
import { INotification } from "../../../models/notification/notification.model";
import { Notification } from "../../../models/notification/notification.model";
import { AppError } from "../../../utils/error";
@Service()
export class NotificationRepository {
  async create(
    notificationData: Partial<INotification>
  ): Promise<INotification> {
    try {
      const notification = await Notification.create(notificationData);
      console.log(notification)
      return notification;
    } catch (error) {
      throw new AppError("Failed to create notification", 500);
    }
  }

  async findById(id: string): Promise<INotification | null> {
    try {
      return await Notification.findById(id).exec();
    } catch (error) {
      throw new AppError("Failed to fetch notification", 500);
    }
  }

  async update(
    id: string,
    updateData: Partial<INotification>
  ): Promise<INotification | null> {
    try {
      return await Notification.findByIdAndUpdate(id, updateData, {
        new: true,
      }).exec();
    } catch (error) {
      throw new AppError("Failed to update notification", 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await Notification.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new AppError("Failed to delete notification", 500);
    }
  }

  async findAllByRecipient(recipientId: string): Promise<INotification[]> {
    try {
      return await Notification.find({ recipient: recipientId , isDeleted: false}).exec();
    } catch (error) {
      throw new AppError("Failed to fetch notifications", 500);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { $set: { isRead: true } }
      );
    } catch (error) {
      throw new AppError("Failed to mark all notifications as read", 500);
    }
  }

  async countUnread(userId: string): Promise<number> {
    return await Notification.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: false
    });
  }
}

export const notificationRepository = Container.get(NotificationRepository);

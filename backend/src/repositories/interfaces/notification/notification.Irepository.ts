import { INotification } from "../../../models/notification/notification.model";
import { AppError } from "../../../utils/error";

export interface INotificationRepository {
  create(notificationData: Partial<INotification>): Promise<INotification>;
  findById(id: string): Promise<INotification | null>;
  update(
    id: string,
    updateData: Partial<INotification>
  ): Promise<INotification | null>;
  delete(id: string): Promise<void>;
  findAllByRecipient(recipientId: string): Promise<INotification[]>;
  markAllAsRead(userId: string): Promise<void> 

}

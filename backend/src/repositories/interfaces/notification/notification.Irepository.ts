import { INotification } from "../../../models/notification/notification.model";
import { CreateNotificationDTO, UpdateNotificationDTO } from "../../../dtos/notification/notification.dto";

export interface INotificationRepository {
  create(notificationData: CreateNotificationDTO): Promise<INotification>;
  findById(id: string): Promise<INotification | null>;
  update(
    id: string,
    updateData: UpdateNotificationDTO
  ): Promise<INotification | null>;
  delete(id: string): Promise<void>;
  findAllByRecipient(recipientId: string): Promise<INotification[]>;
  markAllAsRead(userId: string): Promise<void>;
  countUnread(userId: string): Promise<number>;
}

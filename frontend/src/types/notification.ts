export interface INotification {
  _id: string;
  recipient: string;
  sender?: string;
  title: string;
  message: string;
  type: "message" | "hostel" | "update" | "alert";
  isRead: boolean;
  isDeleted: boolean;
  relatedId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationDTO {
  recipient: string;
  sender?: string;
  title: string;
  message: string;
  type: "message" | "hostel" | "update" | "alert";
}

export interface UpdateNotificationDTO {
  title?: string;
  message?: string;
  isRead?: boolean;
  isDeleted?: boolean;
}

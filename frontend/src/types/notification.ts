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
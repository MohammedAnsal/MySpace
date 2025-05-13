export interface IMessage {
  _id?: string;
  chatRoomId: string;
  senderId: string;
  senderType: "user" | "provider";
  content: string;
  image?: string;
  replyToMessageId?: string;
  replyToMessage?: IMessage;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IChatRoom {
  _id: string;
  userId: IChatUser;
  providerId: IChatUser;
  lastMessage?: string;
  userUnreadCount: number;
  providerUnreadCount: number;
  lastMessageTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface IChatUser {
  _id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
}

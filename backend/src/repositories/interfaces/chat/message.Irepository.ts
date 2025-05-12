import { Types } from "mongoose";
import { IMessage } from "../../../models/chat/message.model";

export interface IMessageRepository {
  createMessage(messageData: IMessage): Promise<IMessage>;
  findMessageById(messageId: string | Types.ObjectId): Promise<IMessage | null>;
  getMessagesByChatRoom(chatRoomId: string | Types.ObjectId, page?: number, limit?: number): Promise<IMessage[]>;
  markMessageAsSeen(messageId: string | Types.ObjectId): Promise<IMessage | null>;
  markAllMessagesAsSeenInChatRoom(chatRoomId: string | Types.ObjectId, recipientType: "user" | "provider"): Promise<boolean>;
  deleteMessage(messageId: string | Types.ObjectId): Promise<boolean>;
  countUnreadMessages(chatRoomId: string | Types.ObjectId, recipientType: "user" | "provider"): Promise<number>;
  getLatestMessage(chatRoomId: string | Types.ObjectId): Promise<IMessage | null>;
  getReplyMessage(messageId: string | Types.ObjectId): Promise<IMessage | null>;
}

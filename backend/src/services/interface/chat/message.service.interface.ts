import { Types } from "mongoose";
import { IMessage } from "../../../models/chat/message.model";

export interface IMessageService {
  sendMessage(
    chatRoomId: string | Types.ObjectId,
    senderId: string | Types.ObjectId,
    senderType: "user" | "provider",
    content: string,
    image?: string,
    replyToMessageId?: string | Types.ObjectId
  ): Promise<IMessage>;
  getMessageById(messageId: string | Types.ObjectId): Promise<IMessage | null>;
  getChatMessages(
    chatRoomId: string | Types.ObjectId,
    page?: number,
    limit?: number
  ): Promise<IMessage[]>;
  markMessageAsSeen(
    messageId: string | Types.ObjectId
  ): Promise<IMessage | null>;
  markAllMessagesAsSeenInChatRoom(
    chatRoomId: string | Types.ObjectId,
    recipientType: "user" | "provider"
  ): Promise<boolean>;
  getUnreadMessageCount(
    chatRoomId: string | Types.ObjectId,
    recipientType: "user" | "provider"
  ): Promise<number>;
}

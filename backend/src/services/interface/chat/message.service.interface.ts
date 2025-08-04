import { Types } from "mongoose";
import {
  MessageResponseDTO,
  MessageListResponseDTO,
  UnreadCountDTO,
} from "../../../dtos/chat/message.dto";

export interface IMessageService {
  sendMessage(
    chatRoomId: string | Types.ObjectId,
    senderId: string | Types.ObjectId,
    senderType: "user" | "provider",
    content: string,
    image?: string,
    replyToMessageId?: string | Types.ObjectId
  ): Promise<MessageResponseDTO>;

  getMessageById(
    messageId: string | Types.ObjectId
  ): Promise<MessageResponseDTO | null>;

  getChatMessages(
    chatRoomId: string | Types.ObjectId,
    page?: number,
    limit?: number
  ): Promise<MessageListResponseDTO>;

  markMessageAsSeen(
    messageId: string | Types.ObjectId
  ): Promise<MessageResponseDTO | null>;

  markAllMessagesAsSeenInChatRoom(
    chatRoomId: string | Types.ObjectId,
    recipientType: "user" | "provider"
  ): Promise<{ success: boolean; messagesMarkedAsSeen: boolean }>;

  getUnreadMessageCount(
    chatRoomId: string | Types.ObjectId,
    recipientType: "user" | "provider"
  ): Promise<UnreadCountDTO>;
}

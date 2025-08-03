import { Types } from "mongoose";
import {
  ChatRoomResponseDTO,
  ChatRoomListResponseDTO,
} from "../../../dtos/chat/chat.room.dto";

export interface IChatRoomService {
  createChatRoom(
    userId: string | Types.ObjectId,
    providerId: string | Types.ObjectId
  ): Promise<ChatRoomResponseDTO>;

  getChatRoomById(
    chatRoomId: string | Types.ObjectId
  ): Promise<ChatRoomResponseDTO | null>;

  updateLastMessage(
    chatRoomId: string | Types.ObjectId,
    messageId: string | Types.ObjectId,
    messageTime: Date
  ): Promise<ChatRoomResponseDTO | null>;

  incrementUnreadCount(
    chatRoomId: string | Types.ObjectId,
    userType: "user" | "provider"
  ): Promise<ChatRoomResponseDTO | null>;

  resetUnreadCount(
    chatRoomId: string | Types.ObjectId,
    userType: "user" | "provider"
  ): Promise<ChatRoomResponseDTO | null>;

  getUserChatRooms(
    userId: string | Types.ObjectId,
    page?: number,
    limit?: number
  ): Promise<ChatRoomListResponseDTO>;

  getProviderChatRooms(
    providerId: string | Types.ObjectId,
    page?: number,
    limit?: number
  ): Promise<ChatRoomListResponseDTO>;

  deleteChatRoom(chatRoomId: string | Types.ObjectId): Promise<boolean>;
}

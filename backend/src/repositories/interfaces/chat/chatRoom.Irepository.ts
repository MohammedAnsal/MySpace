import { Types } from "mongoose";
import { IChatRoom } from "../../../models/chat/chatRoom.model";

export interface IChatRoomRepository {
  createChatRoom(
    userId: Types.ObjectId,
    providerId: Types.ObjectId
  ): Promise<IChatRoom>;
  findChatRoomByParticipants(
    userId: Types.ObjectId,
    providerId: Types.ObjectId
  ): Promise<IChatRoom | null>;
  findById(chatRoomId: Types.ObjectId): Promise<IChatRoom | null>;
  updateLastMessage(
    chatRoomId: Types.ObjectId,
    lastMessageId: Types.ObjectId
  ): Promise<void>;
  incrementUnreadCount(
    chatRoomId: Types.ObjectId,
    forRole: "user" | "provider"
  ): Promise<void>;
  resetUnreadCount(
    chatRoomId: Types.ObjectId,
    forRole: "user" | "provider"
  ): Promise<void>;
}

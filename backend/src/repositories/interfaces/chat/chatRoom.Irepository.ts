import { Types } from "mongoose";
import { IChatRoom } from "../../../models/chat/chatRoom.model";
import { IMessage } from "../../../models/chat/message.model";
import { CreateChatRoomDTO, UpdateChatRoomDTO } from "../../../dtos/chat/chat.room.dto";

export interface IChatRoomRepository {
  createChatRoom(chatRoomData: CreateChatRoomDTO): Promise<IChatRoom>;
  findChatRoomById(
    chatRoomId: string | Types.ObjectId
  ): Promise<IChatRoom | null>;
  findChatRoomByUserAndProvider(
    userId: string | Types.ObjectId,
    providerId: string | Types.ObjectId
  ): Promise<IChatRoom | null>;
  updateChatRoom(
    chatRoomId: string | Types.ObjectId,
    updateData: UpdateChatRoomDTO
  ): Promise<IChatRoom | null>;
  incrementUnreadCount(
    chatRoomId: string | Types.ObjectId,
    userType: "user" | "provider"
  ): Promise<IChatRoom | null>;
  resetUnreadCount(
    chatRoomId: string | Types.ObjectId,
    userType: "user" | "provider"
  ): Promise<IChatRoom | null>;
  updateLastMessage(
    chatRoomId: string | Types.ObjectId,
    message: IMessage,
    messageTime: Date
  ): Promise<IChatRoom | null>;
  getChatRoomsForUser(
    userId: string | Types.ObjectId,
    page?: number,
    limit?: number
  ): Promise<IChatRoom[]>;
  getChatRoomsForProvider(
    providerId: string | Types.ObjectId,
    page?: number,
    limit?: number
  ): Promise<IChatRoom[]>;
  deleteChatRoom(chatRoomId: string | Types.ObjectId): Promise<boolean>;
}

import { Types } from "mongoose";
import { IChatRoom } from "../../../models/chat/chatRoom.model";

export interface IChatRoomRepository {
  createChatRoom(chatRoomData: IChatRoom): Promise<IChatRoom>;
  findChatRoomById(chatRoomId: string | Types.ObjectId): Promise<IChatRoom | null>;
  findChatRoomByUserAndProvider(userId: string | Types.ObjectId, providerId: string | Types.ObjectId): Promise<IChatRoom | null>;
  updateChatRoom(chatRoomId: string | Types.ObjectId, updateData: Partial<IChatRoom>): Promise<IChatRoom | null>;
  incrementUnreadCount(chatRoomId: string | Types.ObjectId, userType: "user" | "provider"): Promise<IChatRoom | null>;
  resetUnreadCount(chatRoomId: string | Types.ObjectId, userType: "user" | "provider"): Promise<IChatRoom | null>;
  updateLastMessage(chatRoomId: string | Types.ObjectId, messageId: string | Types.ObjectId, messageTime: Date): Promise<IChatRoom | null>;
  getChatRoomsForUser(userId: string | Types.ObjectId, page?: number, limit?: number): Promise<IChatRoom[]>;
  getChatRoomsForProvider(providerId: string | Types.ObjectId, page?: number, limit?: number): Promise<IChatRoom[]>;
  deleteChatRoom(chatRoomId: string | Types.ObjectId): Promise<boolean>;
}

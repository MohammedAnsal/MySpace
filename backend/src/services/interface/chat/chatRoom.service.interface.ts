import { Types } from "mongoose";
import { IChatRoom } from "../../../models/chat/chatRoom.model";

export interface IChatRoomService {
    createChatRoom(userId: string | Types.ObjectId, providerId: string | Types.ObjectId): Promise<IChatRoom>;
    getChatRoomById(chatRoomId: string | Types.ObjectId): Promise<IChatRoom | null>;
    getChatRoomByUserAndProvider(userId: string | Types.ObjectId, providerId: string | Types.ObjectId): Promise<IChatRoom | null>;
    updateLastMessage(chatRoomId: string | Types.ObjectId, messageId: string | Types.ObjectId, messageTime: Date): Promise<IChatRoom | null>;
    incrementUnreadCount(chatRoomId: string | Types.ObjectId, userType: "user" | "provider"): Promise<IChatRoom | null>;
    resetUnreadCount(chatRoomId: string | Types.ObjectId, userType: "user" | "provider"): Promise<IChatRoom | null>;
    getUserChatRooms(userId: string | Types.ObjectId, page?: number, limit?: number): Promise<IChatRoom[]>;
    getProviderChatRooms(providerId: string | Types.ObjectId, page?: number, limit?: number): Promise<IChatRoom[]>;
    deleteChatRoom(chatRoomId: string | Types.ObjectId): Promise<boolean>;
}
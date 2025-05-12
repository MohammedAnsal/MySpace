import Container, { Service } from "typedi";
import { Types } from "mongoose";
import { IChatRoomService } from "../../interface/chat/chatRoom.service.interface";
import { ChatRoomRepository } from "../../../repositories/implementations/chat/chatRoom.repository";
import { IChatRoom } from "../../../models/chat/chatRoom.model";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";

@Service()
export class ChatRoomService implements IChatRoomService {
    private chatRoomRepository: ChatRoomRepository;

    constructor() {
        this.chatRoomRepository = new ChatRoomRepository();
    }

    async createChatRoom(userId: string | Types.ObjectId, providerId: string | Types.ObjectId): Promise<IChatRoom> {
        try {
            // Check if a chat room already exists
            const existingChatRoom = await this.chatRoomRepository.findChatRoomByUserAndProvider(userId, providerId);
            
            if (existingChatRoom) {
                return existingChatRoom;
            }

            // Create a new chat room
            const chatRoomData: IChatRoom = {
                userId: new Types.ObjectId(userId.toString()),
                providerId: new Types.ObjectId(providerId.toString()),
                userUnreadCount: 0,
                providerUnreadCount: 0,
                lastMessageTime: new Date()
            };

            return await this.chatRoomRepository.createChatRoom(chatRoomData);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while creating chat room",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getChatRoomById(chatRoomId: string | Types.ObjectId): Promise<IChatRoom | null> {
        try {
            return await this.chatRoomRepository.findChatRoomById(chatRoomId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while fetching chat room",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getChatRoomByUserAndProvider(userId: string | Types.ObjectId, providerId: string | Types.ObjectId): Promise<IChatRoom | null> {
        try {
            return await this.chatRoomRepository.findChatRoomByUserAndProvider(userId, providerId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while fetching chat room by user and provider",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateLastMessage(chatRoomId: string | Types.ObjectId, messageId: string | Types.ObjectId, messageTime: Date): Promise<IChatRoom | null> {
        try {
            return await this.chatRoomRepository.updateLastMessage(chatRoomId, messageId, messageTime);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while updating last message",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async incrementUnreadCount(chatRoomId: string | Types.ObjectId, userType: "user" | "provider"): Promise<IChatRoom | null> {
        try {
            return await this.chatRoomRepository.incrementUnreadCount(chatRoomId, userType);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while incrementing unread count",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async resetUnreadCount(chatRoomId: string | Types.ObjectId, userType: "user" | "provider"): Promise<IChatRoom | null> {
        try {
            return await this.chatRoomRepository.resetUnreadCount(chatRoomId, userType);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while resetting unread count",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getUserChatRooms(userId: string | Types.ObjectId, page: number = 1, limit: number = 10): Promise<IChatRoom[]> {
        try {
            return await this.chatRoomRepository.getChatRoomsForUser(userId, page, limit);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while fetching user chat rooms",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getProviderChatRooms(providerId: string | Types.ObjectId, page: number = 1, limit: number = 10): Promise<IChatRoom[]> {
        try {
            return await this.chatRoomRepository.getChatRoomsForProvider(providerId, page, limit);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while fetching provider chat rooms",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteChatRoom(chatRoomId: string | Types.ObjectId): Promise<boolean> {
        try {
            return await this.chatRoomRepository.deleteChatRoom(chatRoomId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while deleting chat room",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

export const chatRoomService = Container.get(ChatRoomService);

import Container, { Service } from "typedi";
import { Types } from "mongoose";
import { IChatRoomService } from "../../interface/chat/chatRoom.service.interface";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { IMessageRepository } from "../../../repositories/interfaces/chat/message.Irepository";
import { IChatRoomRepository } from "../../../repositories/interfaces/chat/chatRoom.Irepository";
import { chatRoomRepository } from "../../../repositories/implementations/chat/chatRoom.repository";
import { messageRepository } from "../../../repositories/implementations/chat/message.repository";
import {
  CreateChatRoomDTO,
  ChatRoomResponseDTO,
  ChatRoomListResponseDTO,
  mapToChatRoomResponseDTO,
  mapToChatRoomListResponseDTO,
} from "../../../dtos/chat/chat.room.dto";

@Service()
export class ChatRoomService implements IChatRoomService {
  private chatRoomRepository: IChatRoomRepository;
  private messageRepository: IMessageRepository;

  constructor() {
    this.chatRoomRepository = chatRoomRepository;
    this.messageRepository = messageRepository;
  }

  // Create chat room
  async createChatRoom(
    userId: string | Types.ObjectId,
    providerId: string | Types.ObjectId
  ): Promise<ChatRoomResponseDTO> {
    try {
      const existingChatRoom =
        await this.chatRoomRepository.findChatRoomByUserAndProvider(
          userId,
          providerId
        );

      if (existingChatRoom) {
        return mapToChatRoomResponseDTO(existingChatRoom, true, true);
      }

      const chatRoomData: CreateChatRoomDTO = {
        userId: userId.toString(),
        providerId: providerId.toString(),
      };

      const chatRoom = await this.chatRoomRepository.createChatRoom(chatRoomData);
      return mapToChatRoomResponseDTO(chatRoom, true, true);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while creating chat room",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Get single chat room
  async getChatRoomById(
    chatRoomId: string | Types.ObjectId
  ): Promise<ChatRoomResponseDTO | null> {
    try {
      const chatRoom = await this.chatRoomRepository.findChatRoomById(chatRoomId);
      if (!chatRoom) return null;
      
      return mapToChatRoomResponseDTO(chatRoom, true, true);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while fetching chat room",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Update latest message
  async updateLastMessage(
    chatRoomId: string | Types.ObjectId,
    messageId: string | Types.ObjectId,
    messageTime: Date
  ): Promise<ChatRoomResponseDTO | null> {
    try {
      const message = await this.messageRepository.findMessageById(messageId);

      if (!message) {
        throw new AppError("Message not found", HttpStatus.NOT_FOUND);
      }

      const chatRoom = await this.chatRoomRepository.updateLastMessage(
        chatRoomId,
        message,
        messageTime
      );
      
      if (!chatRoom) return null;
      return mapToChatRoomResponseDTO(chatRoom, true, true);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while updating last message",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async incrementUnreadCount(
    chatRoomId: string | Types.ObjectId,
    userType: "user" | "provider"
  ): Promise<ChatRoomResponseDTO | null> {
    try {
      const chatRoom = await this.chatRoomRepository.incrementUnreadCount(
        chatRoomId,
        userType
      );
      
      if (!chatRoom) return null;
      return mapToChatRoomResponseDTO(chatRoom, true, true);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while incrementing unread count",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resetUnreadCount(
    chatRoomId: string | Types.ObjectId,
    userType: "user" | "provider"
  ): Promise<ChatRoomResponseDTO | null> {
    try {
      const chatRoom = await this.chatRoomRepository.resetUnreadCount(
        chatRoomId,
        userType
      );
      
      if (!chatRoom) return null;
      return mapToChatRoomResponseDTO(chatRoom, true, true);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while resetting unread count",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Get all user chat rooms
  async getUserChatRooms(
    userId: string | Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ): Promise<ChatRoomListResponseDTO> {
    try {
      const chatRooms = await this.chatRoomRepository.getChatRoomsForUser(
        userId,
        page,
        limit
      );
      
      const totalCount = chatRooms.length;
      const hasMore = totalCount === limit;
      
      return mapToChatRoomListResponseDTO(
        chatRooms,
        totalCount,
        hasMore,
        true,
        true
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while fetching user chat rooms",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Get all provider chat rooms
  async getProviderChatRooms(
    providerId: string | Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ): Promise<ChatRoomListResponseDTO> {
    try {
      const chatRooms = await this.chatRoomRepository.getChatRoomsForProvider(
        providerId,
        page,
        limit
      );
      
      const totalCount = chatRooms.length;
      const hasMore = totalCount === limit;
      
      return mapToChatRoomListResponseDTO(
        chatRooms,
        totalCount,
        hasMore,
        true,
        true
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while fetching provider chat rooms",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Delete chat room
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

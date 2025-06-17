import Container, { Service } from "typedi";
import { Types } from "mongoose";
import { IChatRoomService } from "../../interface/chat/chatRoom.service.interface";
import { IChatRoom } from "../../../models/chat/chatRoom.model";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { IMessageRepository } from "../../../repositories/interfaces/chat/message.Irepository";
import { IChatRoomRepository } from "../../../repositories/interfaces/chat/chatRoom.Irepository";
import { chatRoomRepository } from "../../../repositories/implementations/chat/chatRoom.repository";
import { messageRepository } from "../../../repositories/implementations/chat/message.repository";

@Service()
export class ChatRoomService implements IChatRoomService {
  private chatRoomRepository: IChatRoomRepository;
  private messageRepository: IMessageRepository;

  constructor() {
    this.chatRoomRepository = chatRoomRepository;
    this.messageRepository = messageRepository;
  }

  //  Create chat room :-

  async createChatRoom(
    userId: string | Types.ObjectId,
    providerId: string | Types.ObjectId
  ): Promise<IChatRoom> {
    try {
      const existingChatRoom =
        await this.chatRoomRepository.findChatRoomByUserAndProvider(
          userId,
          providerId
        );

      if (existingChatRoom) {
        return existingChatRoom;
      }

      const chatRoomData: IChatRoom = {
        userId: new Types.ObjectId(userId.toString()),
        providerId: new Types.ObjectId(providerId.toString()),
        userUnreadCount: 0,
        providerUnreadCount: 0,
        lastMessageTime: new Date(),
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

  //  Get single chatRoom :-

  async getChatRoomById(
    chatRoomId: string | Types.ObjectId
  ): Promise<IChatRoom | null> {
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

  //  Update latest message :-

  async updateLastMessage(
    chatRoomId: string | Types.ObjectId,
    messageId: string | Types.ObjectId,
    messageTime: Date
  ): Promise<IChatRoom | null> {
    try {
      const message = await this.messageRepository.findMessageById(messageId);

      if (!message) {
        throw new AppError("Message not found", HttpStatus.NOT_FOUND);
      }

      return await this.chatRoomRepository.updateLastMessage(
        chatRoomId,
        message,
        messageTime
      );
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
  ): Promise<IChatRoom | null> {
    try {
      return await this.chatRoomRepository.incrementUnreadCount(
        chatRoomId,
        userType
      );
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
  ): Promise<IChatRoom | null> {
    try {
      return await this.chatRoomRepository.resetUnreadCount(
        chatRoomId,
        userType
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while resetting unread count",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get All user chat room's :-

  async getUserChatRooms(
    userId: string | Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ): Promise<IChatRoom[]> {
    try {
      return await this.chatRoomRepository.getChatRoomsForUser(
        userId,
        page,
        limit
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while fetching user chat rooms",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get All provider chat room's :-

  async getProviderChatRooms(
    providerId: string | Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ): Promise<IChatRoom[]> {
    try {
      return await this.chatRoomRepository.getChatRoomsForProvider(
        providerId,
        page,
        limit
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while fetching provider chat rooms",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Soon :-

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

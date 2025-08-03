import { Types } from "mongoose";
import ChatRoom, { IChatRoom } from "../../../models/chat/chatRoom.model";
import { IChatRoomRepository } from "../../interfaces/chat/chatRoom.Irepository";
import { IMessage } from "../../../models/chat/message.model";
import Container, { Service } from "typedi";
import { CreateChatRoomDTO, UpdateChatRoomDTO } from "../../../dtos/chat/chat.room.dto";

@Service()
export class ChatRoomRepository implements IChatRoomRepository {
  // Create chat room
  async createChatRoom(chatRoomData: CreateChatRoomDTO): Promise<IChatRoom> {
    const dataToCreate = {
      userId: new Types.ObjectId(chatRoomData.userId.toString()),
      providerId: new Types.ObjectId(chatRoomData.providerId.toString()),
      userUnreadCount: 0,
      providerUnreadCount: 0,
      lastMessageTime: new Date(),
    };
    
    const chatRoom = new ChatRoom(dataToCreate);
    const savedChatRoom = await chatRoom.save();
    return savedChatRoom as IChatRoom;
  }

  // Find single chat room
  async findChatRoomById(
    chatRoomId: string | Types.ObjectId
  ): Promise<IChatRoom | null> {
    const chatRoom = await ChatRoom.findById(chatRoomId)
      .populate("providerId", "_id fullName email profile_picture")
      .populate("userId", "_id fullName email profile_picture");

    if (!chatRoom) return null;

    return chatRoom.toObject() as IChatRoom;
  }

  // Find chat room by user and provider
  async findChatRoomByUserAndProvider(
    userId: string | Types.ObjectId,
    providerId: string | Types.ObjectId
  ): Promise<IChatRoom | null> {
    return await ChatRoom.findOne({ userId, providerId });
  }

  // Update chat room
  async updateChatRoom(
    chatRoomId: string | Types.ObjectId,
    updateData: UpdateChatRoomDTO
  ): Promise<IChatRoom | null> {
    return await ChatRoom.findByIdAndUpdate(chatRoomId, updateData, {
      new: true,
    });
  }

  // Increment unread count
  async incrementUnreadCount(
    chatRoomId: string | Types.ObjectId,
    userType: "user" | "provider"
  ): Promise<IChatRoom | null> {
    const updateField =
      userType === "user" ? "userUnreadCount" : "providerUnreadCount";
    return await ChatRoom.findByIdAndUpdate(
      chatRoomId,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );
  }

  // Reset unread count
  async resetUnreadCount(
    chatRoomId: string | Types.ObjectId,
    userType: "user" | "provider"
  ): Promise<IChatRoom | null> {
    const updateField =
      userType === "user" ? "userUnreadCount" : "providerUnreadCount";
    return await ChatRoom.findByIdAndUpdate(
      chatRoomId,
      { [updateField]: 0 },
      { new: true }
    );
  }

  // Update last message
  async updateLastMessage(
    chatRoomId: string | Types.ObjectId,
    message: IMessage,
    messageTime: Date
  ): Promise<IChatRoom | null> {
    return await ChatRoom.findByIdAndUpdate(
      chatRoomId,
      { lastMessage: message.content, lastMessageTime: messageTime },
      { new: true }
    );
  }

  // Get chat rooms for user
  async getChatRoomsForUser(
    userId: string | Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ): Promise<IChatRoom[]> {
    const chatRooms = await ChatRoom.find({ userId })
      .sort({ lastMessageTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("providerId", "_id fullName email profile_picture")
      .populate("userId", "_id fullName email profile_picture");
    return chatRooms.map((room) => room.toObject()) as IChatRoom[];
  }

  // Get chat rooms for provider
  async getChatRoomsForProvider(
    providerId: string | Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ): Promise<IChatRoom[]> {
    const chatRooms = await ChatRoom.find({ providerId })
      .sort({ lastMessageTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "_id fullName email profile_picture")
      .populate("providerId", "_id fullName email profile_picture");

    return chatRooms.map((room) => room.toObject()) as IChatRoom[];
  }

  // Delete chat room
  async deleteChatRoom(chatRoomId: string | Types.ObjectId): Promise<boolean> {
    const result = await ChatRoom.deleteOne({ _id: chatRoomId });
    return result.deletedCount > 0;
  }
}

export const chatRoomRepository = Container.get(ChatRoomRepository);

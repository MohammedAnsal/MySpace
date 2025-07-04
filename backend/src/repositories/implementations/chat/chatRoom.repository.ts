import { Types } from "mongoose";
import ChatRoom, { IChatRoom } from "../../../models/chat/chatRoom.model";
import { IChatRoomRepository } from "../../interfaces/chat/chatRoom.Irepository";
import { IMessage } from "../../../models/chat/message.model";
import Container, { Service } from "typedi";
@Service()
export class ChatRoomRepository implements IChatRoomRepository {
  //  For create chatRoom :-

  async createChatRoom(chatRoomData: IChatRoom): Promise<IChatRoom> {
    const chatRoom = new ChatRoom(chatRoomData);
    const savedChatRoom = await chatRoom.save();
    return savedChatRoom as IChatRoom;
  }

  //  For find single chatRoom :-

  async findChatRoomById(
    chatRoomId: string | Types.ObjectId
  ): Promise<IChatRoom | null> {
    const chatRoom = await ChatRoom.findById(chatRoomId)
      .populate("providerId", "_id fullName email profile_picture")
      .populate("userId", "_id fullName email profile_picture");

    if (!chatRoom) return null;

    return chatRoom.toObject() as IChatRoom;
  }

  //  For create chatRoom :-

  async findChatRoomByUserAndProvider(
    userId: string | Types.ObjectId,
    providerId: string | Types.ObjectId
  ): Promise<IChatRoom | null> {
    return await ChatRoom.findOne({ userId, providerId });
  }

  //  For update single chatRoom :-

  async updateChatRoom(
    chatRoomId: string | Types.ObjectId,
    updateData: Partial<IChatRoom>
  ): Promise<IChatRoom | null> {
    return await ChatRoom.findByIdAndUpdate(chatRoomId, updateData, {
      new: true,
    });
  }

  //  For increment un-read count :-

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

  //  For re-set unread count :-

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

  //  For update latest message :-

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

  //  For user chat room's :-

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

  //  For provider chat room's :-

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

  //  For delete chat room :-

  async deleteChatRoom(chatRoomId: string | Types.ObjectId): Promise<boolean> {
    const result = await ChatRoom.deleteOne({ _id: chatRoomId });
    return result.deletedCount > 0;
  }
}

export const chatRoomRepository = Container.get(ChatRoomRepository);

import { Types } from "mongoose";
import Message, { IMessage } from "../../../models/chat/message.model";
import { IMessageRepository } from "../../interfaces/chat/message.Irepository";
import Container, { Service } from "typedi";
@Service()
export class MessageRepository implements IMessageRepository {
  //  For create message :-

  async createMessage(messageData: IMessage): Promise<IMessage> {
    const message = new Message(messageData);
    const savedMessage = await message.save();
    return savedMessage as IMessage;
  }

  //  For find single message's :-

  async findMessageById(
    messageId: string | Types.ObjectId
  ): Promise<IMessage | null> {
    const message = await Message.findById(messageId);
    return message ? (message.toObject() as IMessage) : null;
  }

  //  For find message by chatRoom :-

  async getMessagesByChatRoom(
    chatRoomId: string | Types.ObjectId,
    page: number = 1,
    limit: number = 20
  ): Promise<IMessage[]> {
    const messages = await Message.find({ chatRoomId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("senderId", "fullName email profile_picture")
      .populate("replyToMessageId");

    return messages.map((msg) => msg.toObject()) as IMessage[];
  }

  //  For message markAsSeen :-

  async markMessageAsSeen(
    messageId: string | Types.ObjectId
  ): Promise<IMessage | null> {
    return await Message.findByIdAndUpdate(
      messageId,
      { isSeen: true },
      { new: true }
    );
  }

  //  For message markAllSeen :-

  async markAllMessagesAsSeenInChatRoom(
    chatRoomId: string | Types.ObjectId,
    recipientType: "user" | "provider"
  ): Promise<boolean> {
    const senderType = recipientType === "user" ? "provider" : "user";
    const result = await Message.updateMany(
      { chatRoomId, senderType, isSeen: false },
      { isSeen: true }
    );
    return result.modifiedCount > 0;
  }

  //  For message un-read count :-

  async countUnreadMessages(
    chatRoomId: string | Types.ObjectId,
    recipientType: "user" | "provider"
  ): Promise<number> {
    const senderType = recipientType === "user" ? "provider" : "user";
    return await Message.countDocuments({
      chatRoomId,
      senderType,
      isSeen: false,
    });
  }

  //  For get latest message :-

  async getLatestMessage(
    chatRoomId: string | Types.ObjectId
  ): Promise<IMessage | null> {
    const lastMessage = await Message.findOne({ chatRoomId })
      .sort({ createdAt: -1 })
      .limit(1);
    return lastMessage as IMessage;
  }

  //  For replay message :-

  async getReplyMessage(
    messageId: string | Types.ObjectId
  ): Promise<IMessage | null> {
    const message = await Message.findOne({
      replyToMessageId: messageId,
    }).populate(
      "replyToMessageId",
      "_id chatRoomId senderId senderType content isSeen"
    );
    return message ? (message.toObject() as IMessage) : null;
  }
}

export const messageRepository = Container.get(MessageRepository);

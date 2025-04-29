import Container, { Service } from "typedi";
import { IMessageRepository } from "../../interfaces/chat/message.Irepository";
import { Types } from "mongoose";
import { IMessage } from "../../../models/chat/message.model";

@Service()
export class MessageRepository {
  // async createMessage(chatRoomId: Types.ObjectId, senderId: Types.ObjectId, senderType: "user" | "provider", content: string, image?: string, replyToMessageId?: Types.ObjectId): Promise<IMessage> {
  //     try {
  //     } catch (error) {
  //     }
  // }
  // async findById(messageId: Types.ObjectId): Promise<IMessage | null> {
  //     try {
  //     } catch (error) {
  //     }
  // }
}

export const messageRepository = Container.get(MessageRepository);

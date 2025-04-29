import { Types } from "mongoose";
import { IMessage } from "../../../models/chat/message.model";

export interface IMessageRepository {
  createMessage(
    chatRoomId: Types.ObjectId,
    senderId: Types.ObjectId,
    senderType: "user" | "provider",
    content: string,
    image?: string,
    replyToMessageId?: Types.ObjectId
  ): Promise<IMessage>;

  findById(messageId: Types.ObjectId): Promise<IMessage | null>;

  findMessagesByChatRoom(chatRoomId: Types.ObjectId): Promise<IMessage[]>;

  updateIsSeen(
    messageId: Types.ObjectId,
    isSeen: boolean
  ): Promise<IMessage | null>;

  deleteMessage(messageId: Types.ObjectId): Promise<void>;
}

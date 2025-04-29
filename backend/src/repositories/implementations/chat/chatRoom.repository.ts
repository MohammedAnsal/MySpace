import Container, { Service } from "typedi";
import { IChatRoomRepository } from "../../interfaces/chat/chatRoom.Irepository";
import { Types } from "mongoose";
import { IChatRoom } from "../../../models/chat/chatRoom.model";

@Service()
export class ChatRoomRepository {
  // async createChatRoom(userId: Types.ObjectId, providerId: Types.ObjectId): Promise<IChatRoom> {
  //     try {
  //     } catch (error) {
  //     }
  // }
  // async findById(chatRoomId: Types.ObjectId): Promise<IChatRoom | null> {
  //     try {
  //     } catch (error) {
  //     }
  // }
}

export const chatRoomRepository = Container.get(ChatRoomRepository);

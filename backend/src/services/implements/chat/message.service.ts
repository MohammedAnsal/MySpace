import Container, { Service } from "typedi";
import { Types } from "mongoose";
import { IMessageService } from "../../interface/chat/message.service.interface";
import { MessageRepository } from "../../../repositories/implementations/chat/message.repository";
import { ChatRoomRepository } from "../../../repositories/implementations/chat/chatRoom.repository";
import { IMessage } from "../../../models/chat/message.model";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";

@Service()
export class MessageService implements IMessageService {
    private messageRepository: MessageRepository;
    private chatRoomRepository: ChatRoomRepository;

    constructor() {
        this.messageRepository = new MessageRepository();
        this.chatRoomRepository = new ChatRoomRepository();
    }

    async sendMessage(
        chatRoomId: string | Types.ObjectId, 
        senderId: string | Types.ObjectId, 
        senderType: "user" | "provider", 
        content: string, 
        image?: string, 
        replyToMessageId?: string | Types.ObjectId
    ): Promise<IMessage> {
        try {
            // Check if chatroom exists
            const chatRoom = await this.chatRoomRepository.findChatRoomById(chatRoomId);
            if (!chatRoom) {
                throw new AppError("Chat room not found", HttpStatus.NOT_FOUND);
            }

            // Create the message
            const messageData: IMessage = {
                chatRoomId: new Types.ObjectId(chatRoomId.toString()),
                senderId: new Types.ObjectId(senderId.toString()),
                senderType,
                content,
                isSeen: false
            };

            if (image) {
                messageData.image = image;
            }

            if (replyToMessageId) {
                // Check if reply message exists
                const replyMessage = await this.messageRepository.findMessageById(replyToMessageId);
                if (!replyMessage) {
                    throw new AppError("Reply message not found", HttpStatus.NOT_FOUND);
                }
                messageData.replyToMessageId = new Types.ObjectId(replyToMessageId.toString());
            }

            const newMessage = await this.messageRepository.createMessage(messageData);

            // Update the chat room's last message
            const recipientType = senderType === "user" ? "provider" : "user";
            await this.chatRoomRepository.updateLastMessage(chatRoomId, newMessage._id!, newMessage.createdAt!);
            await this.chatRoomRepository.incrementUnreadCount(chatRoomId, recipientType);

            return newMessage;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while sending message",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getMessageById(messageId: string | Types.ObjectId): Promise<IMessage | null> {
        try {
            return await this.messageRepository.findMessageById(messageId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while fetching message",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getChatMessages(chatRoomId: string | Types.ObjectId, page: number = 1, limit: number = 20): Promise<IMessage[]> {
        try {
            // Verify chat room exists
            const chatRoom = await this.chatRoomRepository.findChatRoomById(chatRoomId);
            if (!chatRoom) {
                throw new AppError("Chat room not found", HttpStatus.NOT_FOUND);
            }
            
            return await this.messageRepository.getMessagesByChatRoom(chatRoomId, page, limit);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while fetching chat messages",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async markMessageAsSeen(messageId: string | Types.ObjectId): Promise<IMessage | null> {
        try {
            return await this.messageRepository.markMessageAsSeen(messageId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while marking message as seen",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async markAllMessagesAsSeenInChatRoom(chatRoomId: string | Types.ObjectId, recipientType: "user" | "provider"): Promise<boolean> {
        try {
            // Verify chat room exists
            const chatRoom = await this.chatRoomRepository.findChatRoomById(chatRoomId);
            if (!chatRoom) {
                throw new AppError("Chat room not found", HttpStatus.NOT_FOUND);
            }
            
            const result = await this.messageRepository.markAllMessagesAsSeenInChatRoom(chatRoomId, recipientType);
            
            if (result) {
                // Reset unread count for the recipient
                await this.chatRoomRepository.resetUnreadCount(chatRoomId, recipientType);
            }
            
            return result;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while marking messages as seen",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteMessage(messageId: string | Types.ObjectId): Promise<boolean> {
        try {
            return await this.messageRepository.deleteMessage(messageId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while deleting message",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getUnreadMessageCount(chatRoomId: string | Types.ObjectId, recipientType: "user" | "provider"): Promise<number> {
        try {
            // Verify chat room exists
            const chatRoom = await this.chatRoomRepository.findChatRoomById(chatRoomId);
            if (!chatRoom) {
                throw new AppError("Chat room not found", HttpStatus.NOT_FOUND);
            }
            
            return await this.messageRepository.countUnreadMessages(chatRoomId, recipientType);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "An error occurred while getting unread message count",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

export const messageService = Container.get(MessageService);

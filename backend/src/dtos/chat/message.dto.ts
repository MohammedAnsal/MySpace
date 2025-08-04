import { Types } from "mongoose";

// DTO for creating a new message
export interface CreateMessageDTO {
  chatRoomId: string | Types.ObjectId;
  senderId: string | Types.ObjectId;
  senderType: "user" | "provider";
  content?: string;
  image?: string;
  replyToMessageId?: string | Types.ObjectId;
}

// DTO for updating a message
export interface UpdateMessageDTO {
  content?: string;
  image?: string;
  isSeen?: boolean;
}

// DTO for message response (what gets sent to client)
export interface MessageResponseDTO {
  _id: string;
  chatRoomId: string;
  senderId: {
    _id: string;
    fullName?: string;
    email?: string;
    profile_picture?: string;
  };
  senderType: "user" | "provider";
  content?: string;
  image?: string;
  replyToMessageId?: {
    _id: string;
    content?: string;
    senderType?: "user" | "provider"; // Make this optional
  };
  isSeen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// DTO for message list response
export interface MessageListResponseDTO {
  messages: MessageResponseDTO[];
  totalCount: number;
  hasMore: boolean;
  lastMessage?: MessageResponseDTO; // Add this if you want last message
  unreadCount?: number; // Add this if you want unread count
}

// DTO for message filters
export interface MessageFiltersDTO {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

// DTO for marking messages as seen
export interface MarkAsSeenDTO {
  chatRoomId: string;
  recipientType: "user" | "provider";
}

// DTO for unread count
export interface UnreadCountDTO {
  chatRoomId: string;
  recipientType: "user" | "provider";
  unreadCount: number; // <-- Add this line
}

// Utility function to map model to response DTO
export function mapToMessageResponseDTO(
  message: any,
  populateSender?: boolean,
  populateReply?: boolean
): MessageResponseDTO {
  return {
    _id: message._id.toString(),
    chatRoomId: message.chatRoomId.toString(),
    senderId:
      populateSender && message.senderId && typeof message.senderId === "object"
        ? {
            _id: message.senderId._id.toString(),
            fullName: message.senderId.fullName,
            email: message.senderId.email,
            profile_picture: message.senderId.profile_picture,
          }
        : { _id: message.senderId.toString() },
    senderType: message.senderType,
    content: message.content,
    image: message.image,
    replyToMessageId:
      populateReply &&
      message.replyToMessageId &&
      typeof message.replyToMessageId === "object"
        ? {
            _id: message.replyToMessageId._id.toString(),
            content: message.replyToMessageId.content,
            senderType: message.replyToMessageId.senderType,
          }
        : message.replyToMessageId
        ? { _id: message.replyToMessageId.toString() }
        : undefined,
    isSeen: message.isSeen,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

// Utility function to map multiple messages
export function mapToMessageListResponseDTO(
  messages: any[],
  totalCount: number,
  hasMore: boolean,
  populateSender?: boolean,
  populateReply?: boolean
): MessageListResponseDTO {
  return {
    messages: messages.map((message) =>
      mapToMessageResponseDTO(message, populateSender, populateReply)
    ),
    totalCount,
    hasMore,
  };
}

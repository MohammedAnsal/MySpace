import { Types } from "mongoose";

// DTO for creating a new chat room
export interface CreateChatRoomDTO {
  userId: string | Types.ObjectId;
  providerId: string | Types.ObjectId;
}

// DTO for updating a chat room
export interface UpdateChatRoomDTO {
  lastMessage?: string;
  userUnreadCount?: number;
  providerUnreadCount?: number;
  lastMessageTime?: Date;
}

// DTO for chat room response (what gets sent to client)
export interface ChatRoomResponseDTO {
  _id: string;
  userId: {
    _id: string;
    fullName?: string;
    email?: string;
    profile_picture?: string;
  };
  providerId: {
    _id: string;
    fullName?: string;
    email?: string;
    profile_picture?: string;
  };
  lastMessage: string;
  userUnreadCount: number;
  providerUnreadCount: number;
  lastMessageTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

// DTO for chat room list response
export interface ChatRoomListResponseDTO {
  chatRooms: ChatRoomResponseDTO[];
  totalCount: number;
  hasMore: boolean;
}

// DTO for chat room filters
// export interface ChatRoomFiltersDTO {
//   page?: number;
//   limit?: number;
//   sortBy?: "lastMessageTime" | "createdAt";
//   sortOrder?: "asc" | "desc";
// }

// DTO for unread count operations
// export interface UnreadCountDTO {
//   chatRoomId: string;
//   userType: "user" | "provider";
// }

// DTO for last message update
// export interface LastMessageUpdateDTO {
//   chatRoomId: string;
//   messageId: string;
//   messageTime: Date;
// }

// Utility function to map model to response DTO
export function mapToChatRoomResponseDTO(
  chatRoom: any,
  populateUser?: boolean,
  populateProvider?: boolean
): ChatRoomResponseDTO {
  return {
    _id: chatRoom._id.toString(),
    userId: populateUser && chatRoom.userId && typeof chatRoom.userId === 'object'
      ? {
          _id: chatRoom.userId._id.toString(),
          fullName: chatRoom.userId.fullName,
          email: chatRoom.userId.email,
          profile_picture: chatRoom.userId.profile_picture,
        }
      : { _id: chatRoom.userId.toString() },
    providerId: populateProvider && chatRoom.providerId && typeof chatRoom.providerId === 'object'
      ? {
          _id: chatRoom.providerId._id.toString(),
          fullName: chatRoom.providerId.fullName,
          email: chatRoom.providerId.email,
          profile_picture: chatRoom.providerId.profile_picture,
        }
      : { _id: chatRoom.providerId.toString() },
    lastMessage: chatRoom.lastMessage || "",
    userUnreadCount: chatRoom.userUnreadCount || 0,
    providerUnreadCount: chatRoom.providerUnreadCount || 0,
    lastMessageTime: chatRoom.lastMessageTime,
    createdAt: chatRoom.createdAt,
    updatedAt: chatRoom.updatedAt,
  };
}

// Utility function to map multiple chat rooms
export function mapToChatRoomListResponseDTO(
  chatRooms: any[],
  totalCount: number,
  hasMore: boolean,
  populateUser?: boolean,
  populateProvider?: boolean
): ChatRoomListResponseDTO {
  return {
    chatRooms: chatRooms.map(chatRoom =>
      mapToChatRoomResponseDTO(chatRoom, populateUser, populateProvider)
    ),
    totalCount,
    hasMore,
  };
}

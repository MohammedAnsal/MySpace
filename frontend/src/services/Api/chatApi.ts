import { userAxiosInstance } from "@/services/axiosInstance/userInstance";

import { IChatRoom, IMessage } from "../../types/chat";

interface ChatResponse<T> {
  success: boolean;
  message?: string;
  chatRoom?: IChatRoom;
  chatRooms?: IChatRoom[];
  messages?: IMessage[];
  unreadCount?: number;
  messagesMarkedAsSeen?: boolean;
}

const handleError = (error: any) => {
  console.error(error);
  throw error;
};

export const chatApi = {
  //  Chat Room Api's

  createChatRoom: async (
    userId: string,
    providerId: string
  ): Promise<IChatRoom> => {
    try {
      const response = await userAxiosInstance.post<ChatResponse<IChatRoom>>(
        "/chat/rooms",
        { userId, providerId }
      );
      return response.data.chatRoom!;
    } catch (error) {
      return handleError(error);
    }
  },

  getChatRoom: async (chatRoomId: string): Promise<IChatRoom> => {
    try {
      const response = await userAxiosInstance.get<ChatResponse<IChatRoom>>(
        `/chat/rooms/${chatRoomId}`
      );
      return response.data.chatRoom!;
    } catch (error) {
      return handleError(error);
    }
  },

  getUserChatRooms: async (
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IChatRoom[]> => {
    try {
      const response = await userAxiosInstance.get<ChatResponse<IChatRoom[]>>(
        `/chat/users/${userId}/rooms`,
        {
          params: { page, limit },
        }
      );
      return response.data.chatRooms!;
    } catch (error) {
      return handleError(error);
    }
  },

  getProviderChatRooms: async (
    providerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IChatRoom[]> => {
    try {
      const response = await userAxiosInstance.get<ChatResponse<IChatRoom[]>>(
        `/chat/providers/${providerId}/rooms`,
        {
          params: { page, limit },
        }
      );
      return response.data.chatRooms!;
    } catch (error) {
      return handleError(error);
    }
  },

  deleteChatRoom: async (chatRoomId: string): Promise<boolean> => {
    try {
      const response = await userAxiosInstance.delete<ChatResponse<boolean>>(
        `/chat/rooms/${chatRoomId}`
      );
      return response.data.success;
    } catch (error) {
      return handleError(error);
    }
  },

  // Messages Api's :-

  sendMessage: async (
    chatRoomId: string,
    senderId: string,
    senderType: "user" | "provider",
    content: string,
    image?: string,
    replyToMessageId?: string
  ): Promise<IMessage> => {
    try {
      const response = await userAxiosInstance.post<ChatResponse<IMessage>>(
        "/chat/messages",
        {
          chatRoomId,
          senderId,
          senderType,
          content,
          image,
          replyToMessageId,
        }
      );

      // Check if response.data.messages exists before accessing index 0
      if (response.data.message) {
        return response.data.message as unknown as IMessage;
      } else if (response.data.messages && response.data.messages.length > 0) {
        return response.data.messages[0];
      } else {
        // Create a fallback message with the data we sent
        return {
          _id: "", // This will be replaced when the page refreshes
          chatRoomId: chatRoomId,
          senderId: senderId,
          senderType: senderType,
          updatedAt: new Date().toISOString(),
          content: content,
          image: image,
          isSeen: false,
          createdAt: new Date().toISOString(),
          replyToMessageId: replyToMessageId as any,
        };
      }
    } catch (error) {
      return handleError(error);
    }
  },

  getChatMessages: async (
    chatRoomId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<IMessage[]> => {
    try {
      const response = await userAxiosInstance.get<ChatResponse<IMessage[]>>(
        `/chat/rooms/${chatRoomId}/messages`,
        {
          params: { page, limit },
        }
      );

      return response.data.messages!;
    } catch (error) {
      return handleError(error);
    }
  },

  markMessagesAsSeen: async (
    chatRoomId: string,
    recipientType: "user" | "provider"
  ): Promise<boolean> => {
    try {
      const response = await userAxiosInstance.patch<ChatResponse<boolean>>(
        `/chat/rooms/${chatRoomId}/messages/seen`,
        {
          recipientType,
        }
      );
      return response.data.messagesMarkedAsSeen || false;
    } catch (error) {
      return handleError(error);
    }
  },

  deleteMessage: async (messageId: string): Promise<boolean> => {
    try {
      const response = await userAxiosInstance.delete<ChatResponse<boolean>>(
        `/chat/messages/${messageId}`
      );
      return response.data.success;
    } catch (error) {
      return handleError(error);
    }
  },

  getUnreadMessageCount: async (
    chatRoomId: string,
    recipientType: "user" | "provider"
  ): Promise<number> => {
    try {
      const response = await userAxiosInstance.get<ChatResponse<number>>(
        `/chat/rooms/${chatRoomId}/unread`,
        {
          params: { recipientType },
        }
      );
      return response.data.unreadCount || 0;
    } catch (error) {
      return handleError(error);
    }
  },
};

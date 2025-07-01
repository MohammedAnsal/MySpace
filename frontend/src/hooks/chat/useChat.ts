import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi } from "../../services/Api/chatApi";
import socketService from "../../services/socket/socket.service";
import { IChatRoom, IMessage } from "../../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { debounce } from "lodash";

interface UseChatProps {
  selectedChatRoomId?: string;
  userType: "user" | "provider";
}

export const useChat = ({ selectedChatRoomId, userType }: UseChatProps) => {
  const { userId } = useSelector((state: RootState) => state.user);

  const [chatRooms, setChatRooms] = useState<IChatRoom[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<IChatRoom | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [typingStatus, setTypingStatus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketConnectedRef = useRef(false);

  // Load chat rooms :- (Both)

  const loadChatRooms = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const rooms =
        userType === "user"
          ? await chatApi.getUserChatRooms(userId)
          : await chatApi.getProviderChatRooms(userId);

      setChatRooms(rooms);

      // Join all chat rooms when they are loaded :-

      if (socketService.isConnected()) {
        rooms.forEach((room) => {
          socketService.joinRoom(userId, room._id);
        });
      }
    } catch (err: unknown) {
      setError("Failed to load chat rooms");
    } finally {
      setLoading(false);
    }
  }, [userId, userType]);

  // Select a chat room :-

  const selectChatRoom = useCallback(
    async (chatRoomId: string) => {
      try {
        setLoading(true);

        // Leave previous room if any :-
        if (selectedChatRoom && userId) {
          socketService.leaveRoom(userId, selectedChatRoom._id);
        }

        // Reset messages and page number before loading new :-
        setMessages([]);
        setPage(1);
        setHasMore(true);

        // Get new room data :-
        const roomData = await chatApi.getChatRoom(chatRoomId);
        setSelectedChatRoom(roomData);

        // Join new room
        if (userId) {
          socketService.joinRoom(userId, chatRoomId);
        }

        // Mark messages as seen when entering a room
        if (userId) {
          await chatApi.markMessagesAsSeen(chatRoomId, userType);
        }

        // Load messages
        const messagesData = await chatApi.getChatMessages(chatRoomId);

        setMessages(messagesData);

        // Reset unread count for this room
        setChatRooms((prev) =>
          prev.map((room) => {
            if (room._id === chatRoomId) {
              return {
                ...room,
                userUnreadCount: userType === "user" ? 0 : room.userUnreadCount,
                providerUnreadCount:
                  userType === "provider" ? 0 : room.providerUnreadCount,
              };
            }
            return room;
          })
        );
      } catch (err: unknown) {
        console.error("Error selecting chat room:", err);
        setError("Failed to select chat room");
      } finally {
        setLoading(false);
      }
    },
    [selectedChatRoom, userId, userType]
  );

  // Load more messages (pagination) :-

  const loadMoreMessages = useCallback(async () => {
    if (!selectedChatRoom || !hasMore || loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const moreMessages = await chatApi.getChatMessages(
        selectedChatRoom._id,
        nextPage
      );

      if (moreMessages.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => [...prev, ...moreMessages]);
        setPage(nextPage);
      }
    } catch (err: unknown) {
      setError("Failed to load more messages");
    } finally {
      setLoading(false);
    }
  }, [selectedChatRoom, page, hasMore, loading]);

  // Send message :- (Main) - FIXED FOR IMAGES
  const sendMessage = useCallback(
    async (content: string, image?: string, replyToMessageId?: string) => {
      if (!selectedChatRoom || !userId) return;

      // Don't send if both content and image are empty
      if (!content.trim() && !image) return;

      try {
        // Create a temporary message for immediate display
        const tempId = `temp-${Date.now()}`;
        const tempMessage: IMessage = {
          _id: tempId,
          chatRoomId: selectedChatRoom._id,
          senderId: userId,
          senderType: userType,
          content: content || "", // Use empty string if no content
          image: image || undefined, // Include image if provided
          isSeen: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          replyToMessageId: replyToMessageId || undefined,
        };

        // Add temp message to the UI immediately for responsiveness
        setMessages((prevMessages) => [tempMessage, ...prevMessages]);

        // Update the local chat rooms list for immediate UI feedback
        // Show appropriate last message text
        const lastMessageText = image ? "📷 Image" : content;

        setChatRooms((prevRooms) =>
          prevRooms.map((room) => {
            if (room._id === selectedChatRoom._id) {
              return {
                ...room,
                lastMessage: lastMessageText,
                lastMessageTime: new Date().toISOString(),
              };
            }
            return room;
          })
        );

        // IMPORTANT: Save message to database FIRST, then emit via socket
        const savedMessage = await chatApi.sendMessage(
          selectedChatRoom._id,
          userId,
          userType,
          content,
          image,
          replyToMessageId
        );

        // Replace the temp message with the real one
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg._id === tempId ? savedMessage : msg))
        );

        // NOW send message via socket for real-time delivery to other users
        // Make sure to include the image in the socket message
        socketService.sendMessage({
          chatRoomId: selectedChatRoom._id,
          senderId: userId,
          senderType: userType,
          content: content || "",
          image: image || undefined,
          replyToMessageId,
          _id: savedMessage._id,
        });

        // Clear typing status
        setTypingStatus((prev) => ({ ...prev, [userId]: false }));
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        socketService.sendTypingStatus(selectedChatRoom._id, userId, false);
      } catch (err: unknown) {
        console.error("Error sending message:", err);

        // Mark the temp message as failed but leave it visible
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id && typeof msg._id === "string" && msg._id.includes("temp-")
              ? { ...msg, failed: true }
              : msg
          )
        );

        setError("Failed to send message");
      }
    },
    [selectedChatRoom, userId, userType]
  );

  // Implement debounced typing status :-

  const debouncedEmitTyping = useCallback(
    debounce((chatRoomId: string, userId: string, isTyping: boolean) => {
      socketService.sendTypingStatus(chatRoomId, userId, isTyping);
    }, 300),
    []
  );

  // Start typing :-

  const startTyping = useCallback(() => {
    if (!selectedChatRoom || !userId) return;

    // Set local typing status
    setTypingStatus((prev) => ({ ...prev, [userId]: true }));

    // Emit typing event with debounce
    debouncedEmitTyping(selectedChatRoom._id, userId, true);

    // Clear previous timeout if exists
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTypingStatus((prev) => ({ ...prev, [userId]: false }));
      socketService.sendTypingStatus(selectedChatRoom._id, userId, false);
    }, 2000);
  }, [selectedChatRoom, userId, debouncedEmitTyping]);

  // Create a new chat room :-

  const createChatRoom = useCallback(
    async (otherUserId: string) => {
      if (!userId) return null;

      try {
        setLoading(true);
        const targetId = userType === "user" ? otherUserId : userId;
        const currentUserId = userType === "user" ? userId : otherUserId;

        const newRoomStub = await chatApi.createChatRoom(
          currentUserId,
          targetId
        );

        if (!newRoomStub) {
          throw new Error("Room creation failed to return a room stub.");
        }

        //  Come the new room in the chat list :-

        const newRoomFull = await chatApi.getChatRoom(newRoomStub._id);

        setChatRooms((prev) => [
          newRoomFull,
          ...prev.filter((room) => room._id !== newRoomFull._id),
        ]);

        return newRoomFull;
      } catch (err: unknown) {
        setError("Failed to create chat room");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId, userType]
  );

  // Mark messages as seen :-

  const markMessagesAsSeen = useCallback(async () => {
    if (!selectedChatRoom) return;

    try {
      await chatApi.markMessagesAsSeen(selectedChatRoom._id, userType);

      // Also emit via socket for real-time updates
      socketService.markMessagesAsSeen(selectedChatRoom._id, userType);

      // Update chat rooms list to reset unread count
      setChatRooms((prev) =>
        prev.map((room) =>
          room._id === selectedChatRoom._id
            ? {
                ...room,
                userUnreadCount: userType === "user" ? 0 : room.userUnreadCount,
                providerUnreadCount:
                  userType === "provider" ? 0 : room.providerUnreadCount,
              }
            : room
        )
      );

      // Update messages to mark them as seen
      setMessages((prev) =>
        prev.map((message) => ({
          ...message,
          isSeen: true,
        }))
      );
    } catch (err: unknown) {
      setError("Failed to mark messages as seen");
    }
  }, [selectedChatRoom, userType]);

  // Socket event listeners
  useEffect(() => {
    // Connect to socket server if not already connected
    if (!socketService.isConnected()) {
      socketService.connect();
      socketConnectedRef.current = true;
    }

    // Join all existing chat rooms when socket connects
    if (userId && chatRooms.length > 0) {
      chatRooms.forEach((room) => {
        socketService.joinRoom(userId, room._id);
      });
    }

    // Set up reconnection handling
    const handleReconnect = () => {
      if (userId && chatRooms.length > 0) {
        chatRooms.forEach((room) => {
          socketService.joinRoom(userId, room._id);
        });
      }
    };

    socketService.addEventListener("connect", handleReconnect);

    return () => {
      socketService.removeEventListener("connect", handleReconnect);
      // Don't disconnect here, let the socket service handle disconnection
      socketConnectedRef.current = false;
    };
  }, [userId, chatRooms]);

  // Set up message listeners - FIXED FOR IMAGES
  useEffect(() => {
    if (!userId) return;

    const handleSocketMessage = (message: IMessage) => {
      // Update chat rooms list with the new message
      setChatRooms((prevRooms) => {
        // Find the room that needs to be updated
        const roomToUpdate = prevRooms.find(
          (room) => room._id === message.chatRoomId
        );

        if (roomToUpdate) {
          // Create appropriate last message text for display
          const lastMessageText = message.image ? "📷 Image" : message.content;

          // Create updated room with new message info
          const updatedRoom = {
            ...roomToUpdate,
            lastMessage: lastMessageText,
            lastMessageTime: message.createdAt,
          };

          // Increment unread count if the message is not from the current user
          // and the user is not currently in this chat room
          if (
            message.senderId !== userId &&
            selectedChatRoom?._id !== message.chatRoomId
          ) {
            if (userType === "user") {
              updatedRoom.userUnreadCount =
                (updatedRoom.userUnreadCount || 0) + 1;
            } else {
              updatedRoom.providerUnreadCount =
                (updatedRoom.providerUnreadCount || 0) + 1;
            }
          }

          // Remove the room from its current position and add it to the top
          const otherRooms = prevRooms.filter(
            (room) => room._id !== message.chatRoomId
          );
          return [updatedRoom, ...otherRooms];
        }

        // If room doesn't exist, refresh chat rooms
        if (!prevRooms.some((room) => room._id === message.chatRoomId)) {
          loadChatRooms();
        }

        return prevRooms;
      });

      // If this message is for the currently selected chat room, add it to messages
      if (selectedChatRoom?._id === message.chatRoomId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) {
            return prev;
          }
          return [message, ...prev];
        });
      }
    };

    const handleTypingStatus = (data: {
      chatRoomId: string;
      userId: string;
      isTyping: boolean;
    }) => {
      if (data.userId !== userId) {
        setTypingStatus((prev) => ({
          ...prev,
          [data.userId]: data.isTyping,
        }));
      }
    };

    const handleMessagesSeen = (data: {
      chatRoomId: string;
      recipientType: string;
    }) => {
      // Update seen status for all messages in this room
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          isSeen: true,
        }))
      );

      // Reset unread count for this room
      setChatRooms((prev) =>
        prev.map((room) => {
          if (room._id === data.chatRoomId) {
            return {
              ...room,
              userUnreadCount: userType === "user" ? 0 : room.userUnreadCount,
              providerUnreadCount:
                userType === "provider" ? 0 : room.providerUnreadCount,
            };
          }
          return room;
        })
      );
    };

    // Register for socket events
    socketService.addEventListener("receive_message", handleSocketMessage);
    socketService.addEventListener("user_typing", handleTypingStatus);
    socketService.addEventListener("messages_seen", handleMessagesSeen);

    // Clean up
    return () => {
      socketService.removeEventListener("receive_message", handleSocketMessage);
      socketService.removeEventListener("user_typing", handleTypingStatus);
      socketService.removeEventListener("messages_seen", handleMessagesSeen);
    };
  }, [userId, selectedChatRoom, userType, loadChatRooms]);

  // Effect to handle new message notifications (when not in the current room)
  useEffect(() => {
    const handleNewMessageNotification = (data: {
      chatRoomId: string;
      message: IMessage;
    }) => {
      // Update chat rooms list with the new message
      setChatRooms((prev) => {
        const updatedRooms = prev.map((room) => {
          if (room._id === data.chatRoomId) {
            // Create appropriate last message text
            const lastMessageText = data.message.image
              ? "📷 Image"
              : data.message.content;

            // Increment unread count based on user type
            const updatedRoom = {
              ...room,
              lastMessage: lastMessageText,
              lastMessageTime: data.message.createdAt,
            };

            if (userType === "user") {
              updatedRoom.userUnreadCount =
                (updatedRoom.userUnreadCount || 0) + 1;
            } else {
              updatedRoom.providerUnreadCount =
                (updatedRoom.providerUnreadCount || 0) + 1;
            }

            return updatedRoom;
          }
          return room;
        });

        // If no existing room was found with this ID, refresh chat rooms
        if (!updatedRooms.some((room) => room._id === data.chatRoomId)) {
          loadChatRooms();
        }

        return updatedRooms;
      });
    };

    socketService.addEventListener(
      "new_message_notification",
      handleNewMessageNotification
    );

    return () => {
      socketService.removeEventListener(
        "new_message_notification",
        handleNewMessageNotification
      );
    };
  }, [userType, loadChatRooms]);

  // Effect to load chat rooms on component mount
  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  // Effect to select chat room if provided
  useEffect(() => {
    if (selectedChatRoomId) {
      // Only select if different from current room
      if (selectedChatRoom?._id !== selectedChatRoomId) {
        selectChatRoom(selectedChatRoomId);
      }
    }
  }, [selectedChatRoomId, selectChatRoom, selectedChatRoom]);

  //  Upload Image :- Send a image :-

  const uploadImage = useCallback(
    async (file: File, replyToMessageId?: string): Promise<IMessage | null> => {
      try {
        if (!userId || !selectedChatRoom) return null;

        const message = await chatApi.uploadMessageImage(
          file,
          String(selectedChatRoom._id),
          userId,
          userType,
          replyToMessageId
        );

        setMessages((prev) => [message, ...prev]);

        socketService.sendMessage({
          chatRoomId: selectedChatRoom._id,
          senderId: userId,
          senderType: userType,
          content: message.content || "",
          image: message.image,
          replyToMessageId,
          _id: message._id,
        });

        return message;
      } catch (error) {
        console.error("Error uploading image:", error);
        setError(
          error instanceof Error ? error.message : "Failed to upload image"
        );
        return null;
      }
    },
    [userId, selectedChatRoom, userType]
  );

  return {
    chatRooms,
    messages,
    selectedChatRoom,
    loading,
    error,
    typingStatus,
    hasMore,
    selectChatRoom,
    loadMoreMessages,
    sendMessage,
    startTyping,
    createChatRoom,
    markMessagesAsSeen,
    refreshChatRooms: loadChatRooms,
    uploadImage,
  };
};

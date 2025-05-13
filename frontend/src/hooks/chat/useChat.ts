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
    } catch (err: any) {
      setError(err.message || "Failed to load chat rooms");
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

        if (!socketService.isConnected()) {
          console.log(
            "Socket not connected when selecting room, connecting now..."
          );
          socketService.connect();
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Get newww room data :-
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
        console.log(
          `Loaded ${messagesData.length} messages for room:`,
          chatRoomId
        );
        setMessages(messagesData);
      } catch (err: any) {
        console.error("Error selecting chat room:", err);
        setError(err.message || "Failed to select chat room");
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
    } catch (err: any) {
      setError(err.message || "Failed to load more messages");
    } finally {
      setLoading(false);
    }
  }, [selectedChatRoom, page, hasMore, loading]);

  // Send message :- (Main)

  const sendMessage = useCallback(
    async (content: string, image?: string, replyToMessageId?: string) => {
      if (!selectedChatRoom || !userId) return;

      try {
        // Create a temporary message for immediate display
        const tempId = `temp-${Date.now()}`;
        const tempMessage: IMessage = {
          _id: tempId as any,
          chatRoomId: selectedChatRoom._id as any,
          senderId: userId as any,
          senderType: userType,
          content: content,
          image: image,
          isSeen: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          replyToMessageId: replyToMessageId as any,
        };

        // Add temp message to the UI immediately for responsiveness
        setMessages((prevMessages) => [tempMessage, ...prevMessages]);

        // Update the local chat rooms list for immediate UI feedback
        setChatRooms((prevRooms) =>
          prevRooms.map((room) => {
            if (room._id === selectedChatRoom._id) {
              return {
                ...room,
                lastMessage: content,
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
        
        socketService.sendMessage({
          chatRoomId: selectedChatRoom._id,
          senderId: userId,
          senderType: userType,
          content,
          image,
          replyToMessageId,
          _id: savedMessage._id, 
        });

        // Clear typing status
        setTypingStatus((prev) => ({ ...prev, [userId]: false }));
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        socketService.sendTypingStatus(selectedChatRoom._id, userId, false);
      } catch (err: any) {
        console.error("Error sending message:", err);

        // Mark the temp message as failed but leave it visible
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id && typeof msg._id === "string" && msg._id.includes("temp-")
              ? { ...msg, failed: true }
              : msg
          )
        );

        setError(err.message || "Failed to send message");
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

        const newRoom = await chatApi.createChatRoom(currentUserId, targetId);
        setChatRooms((prev) => [
          newRoom,
          ...prev.filter((room) => room._id !== newRoom._id),
        ]);

        return newRoom;
      } catch (err: any) {
        setError(err.message || "Failed to create chat room");
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
    } catch (err: any) {
      setError(err.message || "Failed to mark messages as seen");
    }
  }, [selectedChatRoom, userType]);

  // Socket event listeners
  useEffect(() => {
    console.log("Setting up socket connection in useChat hook");

    // Connect to socket server if not already connected
    if (!socketService.isConnected()) {
      console.log("Socket not connected, connecting now...");
      socketService.connect();
      socketConnectedRef.current = true;
    }

    return () => {
      // Only disconnect if we connected in this component
      if (socketConnectedRef.current) {
        console.log("Disconnecting socket in useChat cleanup");
        socketService.disconnect();
      }
    };
  }, []);

  // Set up message listeners
  useEffect(() => {
    if (!selectedChatRoom || !userId) return;

    console.log(
      `Setting up message handlers for room: ${selectedChatRoom._id}`
    );

    const handleSocketMessage = (message: IMessage) => {
      console.log("Received message via socket:", message);

      // Only process if it's for the current room
      if (message.chatRoomId === selectedChatRoom._id) {
        // Don't add duplicates (check if message with same ID already exists)
        setMessages((prev) => {
          // Skip if we already have this message
          if (prev.some((m) => m._id === message._id)) {
            console.log("Duplicate message, not adding:", message._id);
            return prev;
          }

          console.log("Adding new message from socket");
          return [message, ...prev];
        });

        // Update the chat rooms list with latest message
        setChatRooms((prevRooms) =>
          prevRooms.map((room) => {
            if (room._id === message.chatRoomId) {
              return {
                ...room,
                lastMessage: message.content,
                lastMessageTime: message.createdAt,
              };
            }
            return room;
          })
        );

        // Mark as seen if it's from someone else
        if (message.senderId !== userId) {
          console.log("Marking new messages as seen");
          markMessagesAsSeen();
        }
      }
    };

    const handleTypingStatus = (data: {
      chatRoomId: string;
      userId: string;
      isTyping: boolean;
    }) => {
      if (data.chatRoomId === selectedChatRoom._id && data.userId !== userId) {
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
      if (data.chatRoomId !== selectedChatRoom._id) return;

      // Update seen status for all messages in this room
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          isSeen: true,
        }))
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
  }, [selectedChatRoom, userId, markMessagesAsSeen]);

  // Effect to handle new message notifications (when not in the current room)
  useEffect(() => {
    const handleNewMessageNotification = (data: {
      chatRoomId: string;
      message: IMessage;
    }) => {
      console.log("New message notification received:", data);

      // Update chat rooms list with the new message
      setChatRooms((prev) => {
        const updatedRooms = prev.map((room) => {
          if (room._id === data.chatRoomId) {
            // Increment unread count based on user type
            const updatedRoom = {
              ...room,
              lastMessage: data.message.content,
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
  };
};

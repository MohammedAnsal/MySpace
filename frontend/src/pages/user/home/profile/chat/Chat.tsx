import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useChat } from "../../../../../hooks/chat/useChat";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { IChatRoom, IMessage } from "../../../../../types/chat";
import { format } from "date-fns";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { FaUsers } from "react-icons/fa";

import {
  ChatSidebar,
  ChatHeader,
  MessageList,
  MessageInput,
  EmptyChat,
} from "@/pages/user/home/profile/chat/components";

export const Chat = () => {
  const location = useLocation();
  const { userId } = useSelector((state: RootState) => state.user);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<
    string | undefined
  >(undefined);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<IMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {
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
  } = useChat({
    selectedChatRoomId,
    userType: "user",
  });

  //  New chat start when coming from hostel details page :-

  useEffect(() => {
    const state = location.state as {
      providerId?: string;
      createChat?: boolean;
    } | null;

    if (state?.providerId && state?.createChat && userId) {
      const initChat = async () => {
        try {
          const chatRoom = await createChatRoom(state.providerId!);
          if (chatRoom) {
            setSelectedChatRoomId(chatRoom._id);
            selectChatRoom(chatRoom._id);
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }
        } catch (err) {
          toast.error("Failed to create chat with provider");
        }
      };

      initChat();
    }
  }, [location.state, userId, createChatRoom]);

  // For mobile screen size
  useEffect(() => {
    const checkResponsive = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkResponsive();
    window.addEventListener("resize", checkResponsive);
    return () => window.removeEventListener("resize", checkResponsive);
  }, []);

  // Auto-mark messages as seen when viewing them
  useEffect(() => {
    if (selectedChatRoom) {
      markMessagesAsSeen();
    }
  }, [selectedChatRoom, markMessagesAsSeen]);

  // Handle infinite scroll for messages
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || loading) return;

    const { scrollTop } = messagesContainerRef.current;
    // If scrolled to top, load more messages
    if (scrollTop === 0 && hasMore) {
      loadMoreMessages();
    }
  }, [loading, hasMore, loadMoreMessages]);

  // Filter chat rooms based on search query
  const filteredChatRooms = chatRooms.filter((room) => {
    if (!room.userId || typeof room.userId !== "object") return false;

    const userFullName = (room.userId as any).fullName || "";
    const userEmail = (room.userId as any).email || "";

    return (
      userFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Improved scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Use this enhanced effect for scrolling to bottom
  useEffect(() => {
    // Scroll to bottom when messages change or when entering a chat
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [selectedChatRoom, scrollToBottom]);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent, imageUrl?: string) => {
    e.preventDefault();
    if (!messageInput.trim() && !imageUrl) return;

    sendMessage(messageInput, imageUrl, replyToMessage?._id);
    setMessageInput("");
    setReplyToMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    startTyping();
  };

  const formatMessageTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "h:mm a");
    } catch (error) {
      return "";
    }
  };

  const formatLastMessageTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      return isToday ? format(date, "h:mm a") : format(date, "MMM d");
    } catch (error) {
      return "";
    }
  };

  // Get the other user in a chat room
  const getOtherUser = (room: IChatRoom) => {
    const other = userId === room.userId._id ? room.providerId : room.userId;
    return other;
  };

  const isAnyoneTyping = () => {
    if (!selectedChatRoom) return false;

    // Check if any user besides the current user is typing
    return Object.entries(typingStatus).some(
      ([typingUserId, isTyping]) => typingUserId !== userId && isTyping
    );
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessageInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Get recipient name for reply
  const getRecipientName = () => {
    if (!selectedChatRoom) return "User";
    return getOtherUser(selectedChatRoom)?.fullName || "User";
  };

  if (error) {
    toast.error(error);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-[calc(100vh-6rem)] md:h-[calc(100vh)] [@media(min-width:500px)]:h-[100vh] p-2 mt-4 relative"
    >
      {/* Mobile Header */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white h-14 rounded-t-2xl shadow-sm flex items-center justify-between px-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserList(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaUsers className="w-6 h-6 text-gray-600" />
          </motion.button>

          {selectedChatRoom && (
            <ChatHeader
              isMobile={isMobile}
              selectedChatRoom={selectedChatRoom}
              getOtherUser={getOtherUser}
              setShowUserList={setShowUserList}
              isAnyoneTyping={isAnyoneTyping}
            />
          )}
          <div className="w-10" />
        </motion.div>
      )}

      {/* Main Chat Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex h-[calc(100%-3.5rem)] md:h-full bg-gray-50 rounded-b-2xl md:rounded-2xl overflow-hidden shadow-lg"
      >
        {/* User List Sidebar */}
        <ChatSidebar
          isMobile={isMobile}
          showUserList={showUserList}
          setShowUserList={setShowUserList}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredChatRooms={filteredChatRooms}
          selectedChatRoom={selectedChatRoom}
          setSelectedChatRoomId={setSelectedChatRoomId}
          selectChatRoom={selectChatRoom}
          loading={loading}
          userId={userId}
          getOtherUser={getOtherUser}
          formatLastMessageTime={formatLastMessageTime}
        />

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 flex flex-col bg-gray-50"
        >
          {selectedChatRoom ? (
            <>
              {/* Desktop Chat Header */}
              {!isMobile && (
                <ChatHeader
                  isMobile={isMobile}
                  selectedChatRoom={selectedChatRoom}
                  getOtherUser={getOtherUser}
                  setShowUserList={setShowUserList}
                  isAnyoneTyping={isAnyoneTyping}
                />
              )}

              {/* Messages */}
              <MessageList
                messages={messages}
                messagesContainerRef={messagesContainerRef}
                messagesEndRef={messagesEndRef}
                loading={loading}
                handleScroll={handleScroll}
                userId={userId}
                selectedChatRoom={selectedChatRoom}
                getOtherUser={getOtherUser}
                formatMessageTime={formatMessageTime}
                setReplyToMessage={setReplyToMessage}
                isAnyoneTyping={isAnyoneTyping}
              />

              {/* Message Input with Reply Preview */}
              <MessageInput
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                handleSendMessage={handleSendMessage}
                handleInputChange={handleInputChange}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                handleEmojiClick={handleEmojiClick}
                replyToMessage={replyToMessage}
                setReplyToMessage={setReplyToMessage}
                userId={userId}
                getRecipientName={getRecipientName}
                chatRoomId={selectedChatRoom?._id}
              />
            </>
          ) : (
            <EmptyChat />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Chat;

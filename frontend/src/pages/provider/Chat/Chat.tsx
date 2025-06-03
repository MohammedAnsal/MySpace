import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers } from "react-icons/fa";
import { useChat } from "../../../hooks/chat/useChat";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { IMessage } from "../../../types/chat";
import { toast } from "sonner";
import { useSocket } from "../../../contexts/SocketProvider";
import {
  ChatSidebar,
  ChatHeader,
  MessageList,
  MessageInput,
  EmptyChat,
} from "@/pages/provider/Chat/components";
import { format } from "date-fns";

const ProviderChat = () => {
  const { userId } = useSelector((state: RootState) => state.user);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<
    string | undefined
  >(undefined);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<IMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
    markMessagesAsSeen,
    uploadImage,
  } = useChat({
    selectedChatRoomId,
    userType: "provider",
  });

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (selectedChatRoom) {
      markMessagesAsSeen();
    }
  }, [selectedChatRoom, markMessagesAsSeen]);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || loading) return;
    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop === 0 && hasMore) {
      loadMoreMessages();
    }
  }, [loading, hasMore, loadMoreMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(messageInput, undefined, replyToMessage?._id);
    setMessageInput("");
    setReplyToMessage(null);

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    startTyping();
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessageInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const isAnyoneTyping = () => {
    if (!selectedChatRoom) return false;
    return Object.entries(typingStatus).some(
      ([typingUserId, isTyping]) => typingUserId !== userId && isTyping
    );
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

  const formatMessageTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "h:mm a");
    } catch (error) {
      return "";
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        sendMessage("", imageUrl, replyToMessage?._id);
        setReplyToMessage(null);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  if (error) {
    toast.error(error);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-[calc(100vh-6rem)] mt-12 relative"
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
              selectedChatRoom={selectedChatRoom}
              isAnyoneTyping={isAnyoneTyping()}
              onlineUsers={useSocket().onlineUsers}
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
        {/* User List */}
        <AnimatePresence>
          {(!isMobile || showUserList) && (
            <ChatSidebar
              chatRooms={chatRooms}
              selectedChatRoom={selectedChatRoom}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectChat={(
                roomId: React.SetStateAction<string | undefined>
              ) => {
                setSelectedChatRoomId(roomId);
                selectChatRoom(String(roomId));
                setShowUserList(false);
              }}
              isMobile={isMobile}
              showUserList={showUserList}
              onCloseUserList={() => setShowUserList(false)}
              loading={loading}
              onlineUsers={useSocket().onlineUsers}
              formatLastMessageTime={formatLastMessageTime}
            />
          )}
        </AnimatePresence>

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
                  selectedChatRoom={selectedChatRoom}
                  isAnyoneTyping={isAnyoneTyping()}
                  onlineUsers={useSocket().onlineUsers}
                />
              )}

              {/* Messages */}
              <MessageList
                messages={messages}
                selectedChatRoom={selectedChatRoom}
                onReply={setReplyToMessage}
                messagesEndRef={messagesEndRef}
                messagesContainerRef={messagesContainerRef}
                onScroll={handleScroll}
                loading={loading}
                isAnyoneTyping={isAnyoneTyping()}
                formatMessageTime={formatMessageTime}
              />

              {/* Message Input */}
              <MessageInput
                messageInput={messageInput}
                onInputChange={handleInputChange}
                onSendMessage={handleSendMessage}
                showEmojiPicker={showEmojiPicker}
                onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
                onEmojiClick={handleEmojiClick}
                replyToMessage={replyToMessage}
                onCancelReply={() => setReplyToMessage(null)}
                selectedChatRoom={selectedChatRoom}
                onImageUpload={handleImageUpload}
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

export default ProviderChat;

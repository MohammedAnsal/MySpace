import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaRegPaperPlane,
  FaRegSmile,
  FaPaperclip,
  FaUsers,
  FaReply,
  FaTimes,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { useChat } from "../../../../../hooks/chat/useChat";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { IChatRoom, IMessage } from "../../../../../types/chat";
import { format } from "date-fns";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { OnlineStatusDot } from "../../../../../components/shared/OnlineStatusDot";
import { useSocket } from "../../../../../contexts/SocketProvider";

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
  }, [location.state, userId]);

  // For mobile screen size :-

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);


    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll to bottom when messages change or chat room is selected :-

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }, 100);

  //   return () => clearTimeout(timer);
  // }, [messages, selectedChatRoom]);

  // Auto-mark messages as seen when viewing them :-

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
  // const filteredChatRooms = chatRooms.filter(room => {
  //   if (!searchQuery) return true;
  //   const otherUser = getOtherUser(room);
  //   console.log(otherUser)
  //   return otherUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //          otherUser?.email?.toLowerCase().includes(searchQuery.toLowerCase());
  // });

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
  }, [messages, selectedChatRoom]);

  // Use this enhanced effect for scrolling to bottom
  useEffect(() => {
    // Scroll to bottom when messages change or when entering a chat
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, selectedChatRoom, scrollToBottom]);

  // Update the sendMessage :-

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(messageInput, undefined, replyToMessage?._id);

    setMessageInput("");
    setReplyToMessage(null);

    setTimeout(scrollToBottom, 100);
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center"
            >
              <img
                src={
                  getOtherUser(selectedChatRoom)?.profilePicture ||
                  `https://ui-avatars.com/api/?name=${
                    getOtherUser(selectedChatRoom)?.fullName
                  }&background=b9a089&color=fff`
                }
                alt={getOtherUser(selectedChatRoom)?.fullName || "User"}
                className="w-8 h-8 rounded-full"
              />
              {/* <OnlineStatusDot 
                userId={getOtherUser(selectedChatRoom)?._id || ''} 
                className="absolute -bottom-0.5 -right-0.5 border-2 border-white" 
              /> */}
              <span className="ml-2 font-medium">
                {getOtherUser(selectedChatRoom)?.fullName}
              </span>
              <span className="ml-2 text-xs">
                {getOtherUser(selectedChatRoom)?._id &&
                useSocket().onlineUsers[getOtherUser(selectedChatRoom)._id] ? (
                  <span className="text-green-500">Online</span>
                ) : (
                  <span className="text-gray-500">Offline</span>
                )}
              </span>
            </motion.div>
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
        {/* User List - Shown as sidebar on desktop, bottom sheet on mobile */}
        <AnimatePresence>
          {(!isMobile || showUserList) && (
            <motion.div
              initial={isMobile ? { y: "100%" } : { opacity: 0, x: -20 }}
              animate={isMobile ? { y: 0 } : { opacity: 1, x: 0 }}
              exit={isMobile ? { y: "100%" } : { opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className={`
                ${
                  isMobile
                    ? "absolute bottom-0 left-0 right-0 z-50 h-[80vh] rounded-t-3xl"
                    : "w-96"
                }
                bg-white border-r border-gray-200 flex flex-col
              `}
            >
              {/* Bottom sheet handle for mobile */}
              {isMobile && (
                <motion.div
                  className="flex justify-center p-2"
                  onClick={() => setShowUserList(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </motion.div>
              )}

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="p-4 border-b border-gray-200"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#b9a089]/20"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </motion.div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChatRooms.map((room, index) => {
                  const otherUser = getOtherUser(room);
                  const unreadCount =
                    userId === room.userId._id
                      ? room.userUnreadCount
                      : room.providerUnreadCount;

                  return (
                    <motion.div
                      key={room._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      onClick={() => {
                        setSelectedChatRoomId(room._id);
                        selectChatRoom(room._id);

                        setShowUserList(false);
                      }}
                      className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedChatRoom?._id === room._id ? "bg-gray-50" : ""
                      }`}
                      whileHover={{
                        backgroundColor: "rgba(185, 160, 137, 0.1)",
                      }}
                    >
                      <div className="relative">
                        <motion.img
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                          src={
                            otherUser?.profilePicture ||
                            `https://ui-avatars.com/api/?name=${
                              otherUser?.fullName || "User"
                            }&background=b9a089&color=fff`
                          }
                          alt={otherUser?.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <OnlineStatusDot
                          userId={otherUser?._id || ""}
                          className="absolute -bottom-0.5 -right-0.5 border-2 border-white"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <motion.h3
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="font-medium text-gray-900"
                          >
                            {otherUser?.fullName || "User"}
                          </motion.h3>
                          <div className="flex items-center">
                            <span className="text-xs mr-2">
                              {otherUser?._id &&
                              useSocket().onlineUsers[otherUser._id] ? (
                                <span className="text-green-500">Online</span>
                              ) : (
                                <span className="text-gray-500">Offline</span>
                              )}
                            </span>
                            <span className="text-xs text-gray-500">
                              {room.lastMessageTime
                                ? formatLastMessageTime(room.lastMessageTime)
                                : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-500 truncate max-w-[180px]">
                            {room.lastMessage || "No messages yet"}
                          </p>
                          {unreadCount > 0 && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-2 bg-[#b9a089] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                            >
                              {unreadCount}
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {loading && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#b9a089]"></div>
                  </div>
                )}

                {!loading && filteredChatRooms.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32">
                    <FaUsers className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-gray-400 text-sm">
                      No conversations yet
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
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
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-4 bg-white border-b border-gray-200 flex items-center"
                >
                  <motion.img
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    src={
                      getOtherUser(selectedChatRoom)?.profilePicture ||
                      `https://ui-avatars.com/api/?name=${
                        getOtherUser(selectedChatRoom)?.fullName || "User"
                      }&background=b9a089&color=fff`
                    }
                    alt={getOtherUser(selectedChatRoom)?.fullName || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {/* <OnlineStatusDot 
                    userId={getOtherUser(selectedChatRoom)?._id || ''} 
                    /> */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="ml-4"
                  >
                    <h3 className="font-medium text-gray-900">
                      {getOtherUser(selectedChatRoom).fullName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className=" text-xs">
                        {getOtherUser(selectedChatRoom)?._id &&
                        useSocket().onlineUsers[
                          getOtherUser(selectedChatRoom)._id
                        ] ? (
                          <span className="text-green-500">Online</span>
                        ) : (
                          <span className="text-gray-500">Offline</span>
                        )}
                      </span>
                    </div>
                    {isAnyoneTyping() && (
                      <span className="text-xs text-green-500">Typing...</span>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4"
                ref={messagesContainerRef}
                onScroll={handleScroll}
              >
                {loading && messages.length === 0 && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#b9a089]"></div>
                  </div>
                )}

                {/* Sort messages by createdAt to display oldest first */}
                {[...messages]
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .map((message, index) => {
                    // Check if the message is from the current user
                    const isFromUser = message.senderType === "user";

                    return (
                      <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className={`flex ${
                          isFromUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`relative group max-w-[75%] rounded-2xl px-4 py-2 ${
                            isFromUser
                              ? "bg-[#b9a089] text-white rounded-br-none"
                              : "bg-white text-gray-900 rounded-bl-none shadow-sm"
                          }`}
                        >
                          {/* Reply reference */}
                          {message.replyToMessageId && (
                            <div
                              className={`mb-2 text-xs rounded px-2 py-1 border-l-2 ${
                                isFromUser
                                  ? "bg-[#a08970] border-white/50"
                                  : "bg-gray-50 border-[#b9a089]/50"
                              }`}
                            >
                              <div className="font-medium">
                                {message.replyToMessageId &&
                                typeof message.replyToMessageId === "object"
                                  ? (message.replyToMessageId as any)
                                      .senderType === "user"
                                    ? "You"
                                    : getOtherUser(selectedChatRoom)?.fullName
                                  : message.senderType === "user"
                                  ? getOtherUser(selectedChatRoom)?.fullName
                                  : "You"}
                              </div>
                              <div className="truncate">
                                {/* Try to get content from populated reply, otherwise fall back to finding it */}
                                {message.replyToMessageId &&
                                typeof message.replyToMessageId === "object"
                                  ? (message.replyToMessageId as any).content
                                  : messages.find(
                                      (m) => m._id === message.replyToMessageId
                                    )?.content || "Original message"}
                              </div>
                            </div>
                          )}

                          {/* Message content */}
                          <p>{message.content}</p>

                          {/* Image attachment if any */}
                          {message.image && (
                            <img
                              src={message.image}
                              alt="Attached"
                              className="mt-2 rounded-lg max-h-40 w-auto"
                            />
                          )}

                          {/* Message time and seen status */}
                          <div
                            className={`text-xs flex items-center gap-1 mt-1 ${
                              isFromUser ? "opacity-70" : "text-gray-500"
                            }`}
                          >
                            {formatMessageTime(message.createdAt)}
                            {isFromUser && message.isSeen && (
                              <span className="ml-1">✓</span>
                            )}
                          </div>

                          {/* Reply button */}
                          <button
                            onClick={() => setReplyToMessage(message)}
                            className={`absolute opacity-0 group-hover:opacity-100 ${
                              isFromUser ? "-left-8" : "-right-8"
                            } top-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700`}
                          >
                            <FaReply size={12} />
                          </button>
                        </motion.div>
                      </motion.div>
                    );
                  })}

                {/* Show typing indicator */}
                {isAnyoneTyping() && (
                  <div className="flex justify-start">
                    <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Reply preview */}
              {replyToMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 pt-2 bg-gray-50 border-t border-gray-200"
                >
                  <div className="flex items-start justify-between bg-white p-2 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">
                        Replying to{" "}
                        {replyToMessage.senderId === userId
                          ? "yourself"
                          : getOtherUser(selectedChatRoom)?.fullName}
                      </div>
                      <div className="text-sm truncate">
                        {replyToMessage.content || "Original message"}
                      </div>
                    </div>
                    <button
                      onClick={() => setReplyToMessage(null)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Message Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-2 sm:p-4 bg-white border-t border-gray-200"
              >
                {showEmojiPicker && (
                  <div className="absolute bottom-20 left-4 z-10">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-1 sm:gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-[#b9a089] transition-colors rounded-full hover:bg-gray-100"
                  >
                    <FaRegSmile className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                  {/* <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-[#b9a089] transition-colors rounded-full hover:bg-gray-100"
                  >
                    <FaPaperclip className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button> */}
                  <input
                    type="text"
                    value={messageInput}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 min-w-0 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-[#b9a089]/20"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    className="p-2 sm:p-3 bg-[#b9a089] text-white rounded-full hover:bg-[#b9a089]/90 transition-colors"
                  >
                    <FaRegPaperPlane className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </form>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FaUsers className="w-8 h-8 text-gray-400" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-lg sm:text-xl font-medium text-gray-900 mb-2"
                >
                  Welcome to Chat
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-sm sm:text-base text-gray-500"
                >
                  Select a user to start chatting
                </motion.p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Chat;

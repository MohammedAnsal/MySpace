import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaRegPaperPlane,
  FaRegSmile,
  FaPaperclip,
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isSent: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  isOnline: boolean;
}

export const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dummy data for demonstration
  const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=FFB300&color=fff",
      lastMessage: "Hey, how are you?",
      lastMessageTime: "10:30 AM",
      unreadCount: 2,
      isOnline: true,
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      text: "Hi there!",
      sender: "1",
      timestamp: "10:30 AM",
      isSent: false,
    },
    {
      id: "2",
      text: "Hello! How are you doing today?",
      sender: "me",
      timestamp: "10:31 AM",
      isSent: true,
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    // Add message sending logic here
    setMessageInput("");
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    if (isMobile) {
      setShowUserList(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-[calc(100vh-6rem)] mt-4 relative"
    >
      {/* Mobile Header */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white h-14 rounded-t-2xl shadow-sm flex items-center justify-between px-4"
        >
          {selectedUser && !showUserList ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserList(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex items-center absolute left-1/2 transform -translate-x-1/2"
              >
                <div className="relative">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-8 h-8 rounded-full"
                  />
                  {selectedUser.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <span className="ml-2 font-medium text-sm truncate max-w-[120px]">
                  {selectedUser.name}
                </span>
              </motion.div>
              <div className="w-9" />
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold">Chats</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserList(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FaUsers className="w-5 h-5 text-gray-600" />
              </motion.button>
            </>
          )}
        </motion.div>
      )}

      {/* Main Chat Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex h-[calc(100%-3.5rem)] md:h-full bg-gray-50 rounded-b-2xl md:rounded-2xl overflow-hidden shadow-lg relative"
      >
        {/* User List - Desktop: Side panel, Mobile: Full screen when active */}
        <AnimatePresence>
          {(!isMobile || (isMobile && showUserList)) && (
            <motion.div
              initial={isMobile ? { opacity: 0 } : { opacity: 0, x: -20 }}
              animate={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={isMobile ? { opacity: 0 } : { opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className={`
                ${
                  isMobile
                    ? "fixed inset-0 z-20 h-[calc(100%-3.5rem)]"
                    : "w-96 relative"
                } 
                bg-white border-r border-gray-200 flex flex-col
              `}
              style={isMobile ? { top: "3.5rem" } : undefined}
            >
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-white"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-0 focus:ring-[#FFB300] focus:border-[#FFB300]"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </motion.div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto">
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleSelectUser(user)}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    whileHover={{ backgroundColor: "rgba(185, 160, 137, 0.1)" }}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {user.isOnline && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <div className="flex flex-col items-end">
                          <span className="text-[11px] text-gray-500 whitespace-nowrap">
                            {user.lastMessageTime}
                          </span>
                          {user.unreadCount && user.unreadCount > 0 && (
                            <span className="mt-1 bg-[#FFB300] text-white px-1.5 py-0.5 rounded-full text-[10px] min-w-[18px] text-center">
                              {user.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {user.lastMessage}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area - Hidden on mobile when showing user list */}
        <div
          className={`flex-1 flex flex-col ${
            isMobile && showUserList ? "hidden" : ""
          }`}
        >
          {/* Chat Header - Only on desktop */}
          {!isMobile && selectedUser && (
            <div className="h-16 border-b border-gray-200 flex items-center px-6">
              <div className="flex items-center flex-1">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <span className="text-sm text-gray-500">
                    {selectedUser.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {selectedUser ? (
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.isSent ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      relative group max-w-[75%] sm:max-w-[70%] rounded-2xl 
                      px-3 py-2 sm:px-4 sm:py-2.5
                      ${
                        message.isSent
                          ? "bg-[#FFB300] text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                      }
                    `}
                  >
                    <p className="text-[13px] sm:text-base break-words leading-snug">
                      {message.text}
                    </p>
                    <span
                      className={`
                        text-[9px] sm:text-[11px] block mt-1
                        ${message.isSent ? "text-white/70" : "text-gray-400"}
                      `}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-gray-500 text-center text-sm sm:text-base">
                Select a chat to start messaging
              </p>
            </div>
          )}

          {/* Message Input */}
          {selectedUser && (
            <div className="p-2 sm:p-4 border-t border-gray-200 bg-white">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-[#b9a089] transition-colors rounded-full hover:bg-gray-100"
                >
                  <FaRegSmile className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-[#b9a089] transition-colors rounded-full hover:bg-gray-100"
                >
                  <FaPaperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#b9a089]/20"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className={`
                    p-2 rounded-xl transition-colors
                    ${
                      messageInput.trim()
                        ? "bg-[#b9a089] text-white hover:bg-[#b9a089]/90"
                        : "bg-gray-100 text-gray-400"
                    }
                  `}
                >
                  <FaRegPaperPlane className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chat;

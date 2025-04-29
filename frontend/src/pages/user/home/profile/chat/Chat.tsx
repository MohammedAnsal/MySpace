import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaRegPaperPlane, FaRegSmile, FaPaperclip, FaChevronDown, FaUsers } from 'react-icons/fa';

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
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dummy data for demonstration
  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=b9a089&color=fff',
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '10:30 AM',
      unreadCount: 2,
      isOnline: true,
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      text: 'Hi there!',
      sender: '1',
      timestamp: '10:30 AM',
      isSent: false,
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setMessageInput('');
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserList(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaUsers className="w-6 h-6 text-gray-600" />
          </motion.button>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center"
            >
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="ml-2 font-medium">{selectedUser.name}</span>
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
                ${isMobile ? 'absolute bottom-0 left-0 right-0 z-50 h-[80vh] rounded-t-3xl' : 'w-96'}
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
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserList(false);
                    }}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    whileHover={{ backgroundColor: "rgba(185, 160, 137, 0.1)" }}
                  >
                    <div className="relative">
                      <motion.img
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
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
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <motion.h3
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="font-medium text-gray-900"
                        >
                          {user.name}
                        </motion.h3>
                        <span className="text-xs text-gray-500">{user.lastMessageTime}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-500 truncate max-w-[180px]">
                          {user.lastMessage}
                        </p>
                        {user.unreadCount && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-2 bg-[#b9a089] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            {user.unreadCount}
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
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
          {selectedUser ? (
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
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="ml-4"
                  >
                    <h3 className="font-medium text-gray-900">{selectedUser.name}</h3>
                    {selectedUser.isOnline && (
                      <span className="text-xs text-green-500">Online</span>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        message.isSent
                          ? 'bg-[#b9a089] text-white rounded-br-none'
                          : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p>{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp}
                      </span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-2 sm:p-4 bg-white border-t border-gray-200"
              >
                <form onSubmit={handleSendMessage} className="flex items-center gap-1 sm:gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-[#b9a089] transition-colors rounded-full hover:bg-gray-100"
                  >
                    <FaRegSmile className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-[#b9a089] transition-colors rounded-full hover:bg-gray-100"
                  >
                    <FaPaperclip className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
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
                  className="text-xl font-medium text-gray-900 mb-2"
                >
                  Welcome to Chat
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-gray-500"
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

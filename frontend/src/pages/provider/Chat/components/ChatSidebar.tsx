import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUsers } from "react-icons/fa";
import { IChatRoom } from "@/types/chat";
import { OnlineStatusDot } from "@/components/shared/OnlineStatusDot";

interface ChatSidebarProps {
  chatRooms: IChatRoom[];
  selectedChatRoom: IChatRoom | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectChat: (roomId: string) => void;
  isMobile: boolean;
  showUserList: boolean;
  onCloseUserList: () => void;
  loading: boolean;
  onlineUsers: Record<string, boolean>;
  formatLastMessageTime: (date: string) => string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatRooms,
  selectedChatRoom,
  searchQuery,
  onSearchChange,
  onSelectChat,
  isMobile,
  onCloseUserList,
  loading,
  onlineUsers,
  formatLastMessageTime,
}) => {
  const getUser = (room: IChatRoom) => {
    return room.userId && typeof room.userId === "object" ? room.userId : null;
  };

  return (
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
      {isMobile && (
        <motion.div
          className="flex justify-center p-2"
          onClick={onCloseUserList}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </motion.div>
      )}

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
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#b9a089]/20"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        {chatRooms.map((room, index) => {
          const user = getUser(room);
          const unreadCount = room.providerUnreadCount;

          return (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => onSelectChat(room._id)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedChatRoom?._id === room._id ? "bg-gray-50" : ""
              }`}
              whileHover={{ backgroundColor: "rgba(185, 160, 137, 0.1)" }}
            >
              <div className="relative">
                <motion.img
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={
                    (user && (user as any).profilePicture) ||
                    `https://ui-avatars.com/api/?name=${
                      (user && (user as any).fullName) || "User"
                    }&background=b9a089&color=fff`
                  }
                  alt={(user && (user as any).fullName) || "User"}
                  className="w-12 h-12 rounded-full"
                />
                <OnlineStatusDot
                  userId={(user && (user as any)._id) || ""}
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
                    {(user && (user as any).fullName) || "User"}
                  </motion.h3>
                  <div className="flex items-center">
                    <span className="text-xs mr-2">
                      {user &&
                      (user as any)._id &&
                      onlineUsers[(user as any)._id] ? (
                        <span className="text-green-500">Online</span>
                      ) : (
                        <span className="text-gray-500">Offline</span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {room.lastMessageTime
                        ? formatLastMessageTime(room.lastMessageTime.toString())
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

        {!loading && chatRooms.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32">
            <FaUsers className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-gray-400 text-sm">No conversations yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatSidebar;

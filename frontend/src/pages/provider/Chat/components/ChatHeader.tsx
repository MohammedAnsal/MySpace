import React from "react";
import { motion } from "framer-motion";
import { IChatRoom } from "@/types/chat";

interface ChatHeaderProps {
  selectedChatRoom: IChatRoom;
  isAnyoneTyping: boolean;
  onlineUsers: Record<string, boolean>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedChatRoom,
  isAnyoneTyping,
  onlineUsers,
}) => {
  return (
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
          (selectedChatRoom.userId &&
            typeof selectedChatRoom.userId === "object" &&
            (selectedChatRoom.userId as any).profilePicture) ||
          `https://ui-avatars.com/api/?name=${
            selectedChatRoom.userId &&
            typeof selectedChatRoom.userId === "object"
              ? (selectedChatRoom.userId as any).fullName || "User"
              : "User"
          }&background=b9a089&color=fff`
        }
        alt={
          selectedChatRoom.userId && typeof selectedChatRoom.userId === "object"
            ? (selectedChatRoom.userId as any).fullName || "User"
            : "User"
        }
        className="w-10 h-10 rounded-full"
      />
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="ml-4"
      >
        <h3 className="font-medium text-gray-900">
          {selectedChatRoom.userId &&
          typeof selectedChatRoom.userId === "object"
            ? (selectedChatRoom.userId as any).fullName
            : "User"}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs">
            {selectedChatRoom.userId &&
            typeof selectedChatRoom.userId === "object" &&
            (selectedChatRoom.userId as any)._id &&
            onlineUsers[(selectedChatRoom.userId as any)._id] ? (
              <span className="text-green-500">Online</span>
            ) : (
              <span className="text-gray-500">Offline</span>
            )}
          </span>
        </div>
        {isAnyoneTyping && (
          <span className="text-xs text-green-500">Typing...</span>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ChatHeader;

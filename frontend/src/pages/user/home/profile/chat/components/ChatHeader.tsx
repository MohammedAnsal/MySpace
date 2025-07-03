import React from "react";
import { motion } from "framer-motion";
import { IChatRoom } from "@/types/chat";
import { useSocket } from "@/contexts/socketProviderr";

interface ChatHeaderProps {
  isMobile: boolean;
  selectedChatRoom: IChatRoom | null;
  getOtherUser: (room: IChatRoom) => any;
  setShowUserList: (show: boolean) => void;
  isAnyoneTyping: () => boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isMobile,
  selectedChatRoom,
  getOtherUser,
  setShowUserList,
  isAnyoneTyping,
}) => {
  // Mobile header
  if (isMobile && selectedChatRoom) {
    return (
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
        ></motion.button>

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
        <div className="w-10" />
      </motion.div>
    );
  }

  // Desktop header
  if (!isMobile && selectedChatRoom) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-3 sm:p-4 bg-white border-b border-gray-200 flex items-center"
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
            <span className="text-xs">
              {getOtherUser(selectedChatRoom)?._id &&
              useSocket().onlineUsers[getOtherUser(selectedChatRoom)._id] ? (
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
    );
  }

  return null;
};

export default ChatHeader;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaReply } from "react-icons/fa";
import { IMessage, IChatRoom } from "../../../types/chat";
import ImageModal from "../../shared/ImageModal";

interface MessageListProps {
  messages: IMessage[];
  selectedChatRoom: IChatRoom;
  onReply: (message: IMessage) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  loading: boolean;
  isAnyoneTyping: boolean;
  formatMessageTime: (date: string) => string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedChatRoom,
  onReply,
  messagesEndRef,
  messagesContainerRef,
  onScroll,
  loading,
  isAnyoneTyping,
  formatMessageTime,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderMessages = () => {
    const sortedMessages = [...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return sortedMessages.map((message, index) => {
      const isSent = message.senderType === "provider";

      return (
        <motion.div
          key={message._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.5) }}
          className={`flex ${isSent ? "justify-end" : "justify-start"}`}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative group max-w-[75%] rounded-2xl px-4 py-2 ${
              isSent
                ? "bg-gradient-to-b bg-amber-400 text-white rounded-br-none"
                : "bg-white text-gray-900 rounded-bl-none shadow-sm"
            }`}
          >
            {message.replyToMessageId && (
              <div
                className={`mb-2 text-xs rounded px-2 py-1 border-l-2 ${
                  isSent
                    ? "bg-amber-300 border-white/50"
                    : "bg-gray-50 border-amber-500/50"
                }`}
              >
                <div className="font-medium">
                  {message.replyToMessageId &&
                  typeof message.replyToMessageId === "object"
                    ? (message.replyToMessageId as any).senderType ===
                      "provider"
                      ? "You"
                      : selectedChatRoom.userId &&
                        typeof selectedChatRoom.userId === "object"
                      ? (selectedChatRoom.userId as any).fullName
                      : "User"
                    : message.senderType === "provider"
                    ? selectedChatRoom.userId &&
                      typeof selectedChatRoom.userId === "object"
                      ? (selectedChatRoom.userId as any).fullName
                      : "User"
                    : "You"}
                </div>
                <div className="truncate">
                  {message.replyToMessageId &&
                  typeof message.replyToMessageId === "object"
                    ? (message.replyToMessageId as any).content
                    : messages.find((m) => m._id === message.replyToMessageId)
                        ?.content || "Original message"}
                </div>
              </div>
            )}

            <p>{message.content}</p>

            {message.image && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="mt-2 cursor-pointer"
                onClick={() => message.image && setSelectedImage(message.image)}
              >
                <img
                  src={message.image}
                  alt="Attached"
                  className="rounded-lg max-h-40 w-auto hover:opacity-90 transition-opacity"
                />
              </motion.div>
            )}

            <div
              className={`text-xs flex items-center gap-1 mt-1 ${
                isSent ? "opacity-70" : "text-gray-500"
              }`}
            >
              {formatMessageTime(message.createdAt)}
              {isSent && message.isSeen && <span className="ml-1">✓</span>}
            </div>

            <button
              onClick={() => onReply(message)}
              className={`absolute opacity-0 group-hover:opacity-100 ${
                isSent ? "-left-8" : "-right-8"
              } top-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700`}
            >
              <FaReply size={12} />
            </button>
          </motion.div>
        </motion.div>
      );
    });
  };

  return (
    <>
      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4"
        ref={messagesContainerRef}
        onScroll={onScroll}
      >
        {loading && messages.length === 0 && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-400">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}

        {renderMessages()}

        {isAnyoneTyping && (
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

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
      />
    </>
  );
};

export default MessageList;

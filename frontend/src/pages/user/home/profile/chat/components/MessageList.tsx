import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaReply } from "react-icons/fa";
import { IChatRoom, IMessage } from "@/types/chat";
import ImageModal from "@/components/shared/ImageModal";

interface MessageListProps {
  messages: IMessage[];
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
  handleScroll: () => void;
  userId: string | null;
  selectedChatRoom: IChatRoom | null;
  getOtherUser: (room: IChatRoom) => any;
  formatMessageTime: (date: string) => string;
  setReplyToMessage: (message: IMessage | null) => void;
  isAnyoneTyping: () => boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  messagesContainerRef,
  messagesEndRef,
  loading,
  handleScroll,
  selectedChatRoom,
  getOtherUser,
  formatMessageTime,
  setReplyToMessage,
  isAnyoneTyping,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!selectedChatRoom) return null;

  return (
    <>
      <div
        className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col space-y-3 sm:space-y-4"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {loading && messages.length === 0 && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#b9a089]"></div>
          </div>
        )}

        {[...messages]
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
          )
          .map((message, index) => {
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
                  className={`relative group max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 ${
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
                          ? (message.replyToMessageId as any).senderType ===
                            "user"
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
                  {message.content && (
                    <p className="text-sm sm:text-base">{message.content}</p>
                  )}

                  {/* Image attachment */}
                  {message.image && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="mt-2 cursor-pointer"
                      onClick={() =>
                        message.image && setSelectedImage(message.image)
                      }
                    >
                      <img
                        src={message.image}
                        alt="Message attachment"
                        className="max-w-[200px] rounded-lg hover:opacity-90 transition-opacity"
                      />
                    </motion.div>
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

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
      />
    </>
  );
};

export default MessageList; 
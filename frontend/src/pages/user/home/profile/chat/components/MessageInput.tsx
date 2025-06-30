import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaRegSmile, FaRegPaperPlane, FaTimes, FaImage } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { IMessage } from "@/types/chat";
import { toast } from "sonner";
import { useChat } from "@/hooks/chat/useChat";

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (input: string) => void;
  handleSendMessage: (e: React.FormEvent, imageUrl?: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  handleEmojiClick: (emojiData: any) => void;
  replyToMessage: IMessage | null;
  setReplyToMessage: (message: IMessage | null) => void;
  userId: string | null;
  getRecipientName: () => string;
  chatRoomId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
  handleInputChange,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  replyToMessage,
  setReplyToMessage,
  userId,
  getRecipientName,
  chatRoomId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { uploadImage } = useChat({
    selectedChatRoomId: chatRoomId,
    userType: "user",
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() && !selectedImage) return;

    try {
      setIsUploading(true);

      if (selectedImage) {
        const uploadedMessage = await uploadImage(selectedImage);
        if (uploadedMessage) {
          setMessageInput("");
          setReplyToMessage(null);
          removeSelectedImage();
        }
      } else {
        handleSendMessage(e);
        setMessageInput("");
        setReplyToMessage(null);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Reply preview */}
      {replyToMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 sm:px-4 pt-2 bg-gray-50 border-t border-gray-200"
        >
          <div className="flex items-start justify-between bg-white p-2 rounded-lg border border-gray-200">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">
                Replying to{" "}
                {replyToMessage.senderId === userId
                  ? "yourself"
                  : getRecipientName()}
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

      {/* Image Preview */}
      {imagePreview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 sm:px-4 pt-2 bg-gray-50 border-t border-gray-200"
        >
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-32 rounded-lg"
            />
            <button
              onClick={removeSelectedImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <FaTimes size={12} />
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
          onSubmit={handleSubmit}
          className="flex items-center gap-1 sm:gap-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            disabled={isUploading}
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleImageClick}
            disabled={isUploading}
            className={`p-1.5 sm:p-2 text-gray-500 hover:text-[#b9a089] transition-colors rounded-full hover:bg-gray-100 ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaImage className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-[#b9a089] transition-colors rounded-full hover:bg-gray-100"
          >
            <FaRegSmile className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>

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
            disabled={isUploading}
            className={`p-2 sm:p-3 bg-[#b9a089] text-white rounded-full hover:bg-[#b9a089]/90 transition-colors ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaRegPaperPlane className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </motion.button>
        </form>
      </motion.div>
    </>
  );
};

export default MessageInput;

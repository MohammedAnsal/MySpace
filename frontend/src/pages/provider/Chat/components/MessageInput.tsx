import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegPaperPlane, FaRegSmile, FaTimes, FaImage } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { IMessage } from "@/types/chat";

interface MessageInputProps {
  messageInput: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  showEmojiPicker: boolean;
  onToggleEmojiPicker: () => void;
  onEmojiClick: (emojiData: any) => void;
  replyToMessage: IMessage | null;
  onCancelReply: () => void;
  selectedChatRoom: any;
  onImageUpload: (file: File) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageInput,
  onInputChange,
  onSendMessage,
  showEmojiPicker,
  onToggleEmojiPicker,
  onEmojiClick,
  replyToMessage,
  onCancelReply,
  selectedChatRoom,
  onImageUpload,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = () => {
    if (selectedImage) {
      onImageUpload(selectedImage);
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() || selectedImage) {
      if (selectedImage) {
        handleImageUpload();
      }
      onSendMessage(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-2 sm:p-4 bg-white border-t border-gray-200"
    >
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-10">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

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
                {replyToMessage.senderType === "provider"
                  ? "yourself"
                  : selectedChatRoom.userId &&
                    typeof selectedChatRoom.userId === "object"
                  ? (selectedChatRoom.userId as any).fullName
                  : "User"}
              </div>
              <div className="text-sm truncate">{replyToMessage.content}</div>
            </div>
            <button
              onClick={onCancelReply}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </motion.div>
      )}

      {imagePreview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pt-2"
        >
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg"
            />
            <button
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <FaTimes size={12} />
            </button>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-1 sm:gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 sm:p-2 text-gray-500 hover:text-[#b9a089] transition-colors rounded-full hover:bg-gray-100"
        >
          <FaImage className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={onToggleEmojiPicker}
          className="p-1.5 sm:p-2 text-gray-500 hover:text-[#b9a089] transition-colors rounded-full hover:bg-gray-100"
        >
          <FaRegSmile className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
        <input
          type="text"
          value={messageInput}
          onChange={onInputChange}
          placeholder="Type a message..."
          className="flex-1 min-w-0 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-[#b9a089]/20"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="p-2 sm:p-3 bg-amber-500 text-white rounded-full hover:bg-amber-500/90 transition-colors"
        >
          <FaRegPaperPlane className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default MessageInput; 
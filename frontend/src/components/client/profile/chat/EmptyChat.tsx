import React from "react";
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa";

const EmptyChat: React.FC = () => {
  return (
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
          className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FaUsers className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
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
  );
};

export default EmptyChat; 
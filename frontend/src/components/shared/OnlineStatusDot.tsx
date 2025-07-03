import React from "react";
import { useSocket } from "@/contexts/socketProviderr";

interface OnlineStatusDotProps {
  userId: string;
  className?: string;
}

export const OnlineStatusDot: React.FC<OnlineStatusDotProps> = ({
  userId,
  className = "",
}) => {
  const { onlineUsers } = useSocket();
  const isOnline = !!onlineUsers[userId];

  return (
    <div
      className={`w-2.5 h-2.5 rounded-full ${
        isOnline ? "bg-green-500" : "bg-gray-400"
      } ${className}`}
      title={isOnline ? "Online" : "Offline"}
    />
  );
};

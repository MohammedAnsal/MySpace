import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import socketService from "@/services/socket/socket.service";

// Create an online status context
export const SocketContext = createContext<{
  isConnected: boolean;
  onlineUsers: Record<string, boolean>;
}>({
  isConnected: false,
  onlineUsers: {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, userId, role } = useSelector(
    (state: RootState) => state.user
  );
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  // Connect to socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      console.log(
        "Authenticated user detected, establishing socket connection"
      );

      // Connect and emit user presence
      socketService.connect();

      // Emit user_connected with role information for proper status tracking
      socketService.emitUserStatus(userId, role || "user", true);

      // Set up online status event handlers
      const handleUserStatus = (data: {
        userId: string;
        isOnline: boolean;
      }) => {
        setOnlineUsers((prev) => ({
          ...prev,
          [data.userId]: data.isOnline,
        }));
      };

      const handleInitialOnlineUsers = (data: Record<string, boolean>) => {
        setOnlineUsers(data);
      };

      // Listen for online status updates
      socketService.addEventListener("user_status_changed", handleUserStatus);
      socketService.addEventListener(
        "initial_online_users",
        handleInitialOnlineUsers
      );

      // Cleanup on unmount or when user logs out
      return () => {
        // Emit offline status before disconnecting
        if (userId) {
          socketService.emitUserStatus(userId, role || "user", false);
        }

        // Remove event listeners
        socketService.removeEventListener(
          "user_status_changed",
          handleUserStatus
        );
        socketService.removeEventListener(
          "initial_online_users",
          handleInitialOnlineUsers
        );

        console.log("Cleaning up socket connection");
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, userId, role]);

  // Add current user to online list if authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: true,
      }));
    }
  }, [isAuthenticated, userId]);

  // Value to provide to consumers
  const value = {
    isConnected: socketService.isConnected(),
    onlineUsers,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

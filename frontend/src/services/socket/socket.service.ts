import io, { Socket } from "socket.io-client";
import { IMessage } from "@/types/chat";

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private connectionAttempts = 0;
  private userId: string | null = null;
  private userRole: string | null = null;

  //  Connection Area :-

  connect(): void {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    if (this.socket) {
      console.log("Reconnecting existing socket...");
      this.socket.connect();
      return;
    }

    const apiUrl =
      import.meta.env.VITE_USER_BASE_URL || "http://localhost:7001";

    this.socket = io(apiUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.socket.on("connect", () => {
      console.log(`Socket connected with ID: ${this.socket?.id}`);
      this.connectionAttempts = 0;
      this.setupEventListeners();

      // Re-emit online status if we have user info
      if (this.userId && this.userRole) {
        this.emitUserStatus(this.userId, this.userRole, true);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.connectionAttempts++;
    });

    this.socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${reason}`);
      if (reason === "io server disconnect" || reason === "transport close") {
        setTimeout(() => {
          console.log("Attempting to reconnect...");
          this.socket?.connect();
        }, 1000);
      }
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  //------//

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.off("receive_message");
    this.socket.off("messages_seen");
    this.socket.off("user_typing");
    this.socket.off("new_message_notification");
    this.socket.off("user_status_changed");
    this.socket.off("initial_online_users");

    // Add listeners :-

    this.socket.on("receive_message", (message: IMessage) => {
      console.log("Socket received message:", message);
      this.notifyListeners("receive_message", message);
    });

    this.socket.on(
      "messages_seen",
      (data: { chatRoomId: string; recipientType: string }) => {
        console.log("Socket messages seen:", data);
        this.notifyListeners("messages_seen", data);
      }
    );

    this.socket.on(
      "user_typing",
      (data: { chatRoomId: string; userId: string; isTyping: boolean }) => {
        console.log("Socket user typing:", data);
        this.notifyListeners("user_typing", data);
      }
    );

    this.socket.on(
      "new_message_notification",
      (data: { chatRoomId: string; message: IMessage }) => {
        console.log("Socket new message notification:", data);
        this.notifyListeners("new_message_notification", data);
      }
    );

    // Online status listeners
    this.socket.on(
      "user_status_changed",
      (data: { userId: string; isOnline: boolean }) => {
        console.log("Socket user status changed:", data);
        this.notifyListeners("user_status_changed", data);
      }
    );

    this.socket.on(
      "initial_online_users",
      (onlineUsers: Record<string, boolean>) => {
        console.log("Socket initial online users:", onlineUsers);
        this.notifyListeners("initial_online_users", onlineUsers);
      }
    );

    // Single notification listener for all types
    this.socket.on("new_notification", (notification: any) => {
      console.log("Socket received notification:", notification);
      this.notifyListeners("new_notification", notification);
    });

    // Notification count update listener
    this.socket.on("notification_count_update", (data: { count: number }) => {
      console.log("Socket notification count update:", data);
      this.notifyListeners("notification_count_update", data);
    });
  }

  // Methods for online status :-

  emitUserStatus(userId: string, role: string, isOnline: boolean): void {
    if (!this.socket?.connected) {
      console.log(
        "Socket not connected when trying to emit user status, connecting now..."
      );
      // Save user details for reconnection
      this.userId = userId;
      this.userRole = role;
      this.connect();

      // Wait a moment before sending
      setTimeout(() => {
        console.log(
          `Emitting user status after connect: ${userId}, ${
            isOnline ? "online" : "offline"
          }`
        );
        this.socket?.emit("user_status", { userId, role, isOnline });
      }, 500);
      return;
    }

    console.log(
      `Emitting user status: ${userId}, ${isOnline ? "online" : "offline"}`
    );
    this.socket.emit("user_status", { userId, role, isOnline });
  }

  joinRoom(userId: string, chatRoomId: string): void {
    if (!this.socket?.connected) {
      console.log(
        "Socket not connected when trying to join room, connecting now..."
      );
      this.connect();

      // Wait a moment before joining
      setTimeout(() => {
        console.log(
          `Joining room after connect: ${chatRoomId} for user: ${userId}`
        );
        this.socket?.emit("join_room", { userId, chatRoomId });
      }, 500);
      return;
    }

    console.log(`Joining room: ${chatRoomId} for user: ${userId}`);
    this.socket.emit("join_room", { userId, chatRoomId });
  }

  leaveRoom(userId: string, chatRoomId: string): void {
    if (!this.socket?.connected) {
      console.log("Socket not connected when trying to leave room");
      return;
    }

    console.log(`Leaving room: ${chatRoomId} for user: ${userId}`);
    this.socket.emit("leave_room", { userId, chatRoomId });
  }

  sendMessage(messageData: {
    chatRoomId: string;
    senderId: string;
    senderType: "user" | "provider";
    content: string;
    image?: string;
    replyToMessageId?: string;
    _id?: string;
  }): void {
    if (!this.socket?.connected) {
      console.log(
        "Socket not connected when trying to send message, connecting now..."
      );
      this.connect();

      // Wait a moment before sending
      setTimeout(() => {
        console.log("Sending message after connect:", messageData);
        this.socket?.emit("send_message", messageData);
      }, 500);
      return;
    }

    console.log("Sending message via socket:", messageData);
    this.socket.emit("send_message", messageData);
  }

  markMessagesAsSeen(
    chatRoomId: string,
    recipientType: "user" | "provider"
  ): void {
    if (!this.socket?.connected) {
      console.log("Socket not connected when trying to mark messages as seen");
      return;
    }

    console.log(
      `Marking messages as seen in room: ${chatRoomId} for ${recipientType}`
    );
    this.socket.emit("mark_messages_seen", { chatRoomId, recipientType });
  }

  sendTypingStatus(
    chatRoomId: string,
    userId: string,
    isTyping: boolean
  ): void {
    if (!this.socket?.connected) return;

    this.socket.emit("typing", { chatRoomId, userId, isTyping });
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  // Event listener management
  addEventListener(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  removeEventListener(event: string, callback: Function): void {
    this.listeners.get(event)?.delete(callback);
    if (this.listeners.get(event)?.size === 0) {
      this.listeners.delete(event);
    }
  }

  private notifyListeners(event: string, data: any): void {
    console.log(`Notifying listeners for event: ${event}`);
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  disconnect(): void {
    console.log("Disconnecting socket");
    // Emit offline status if we have user info
    if (this.socket?.connected && this.userId && this.userRole) {
      this.emitUserStatus(this.userId, this.userRole, false);
    }
    this.socket?.disconnect();
    this.socket = null;
    this.listeners.clear();
  }

  markNotificationAsRead(notificationId: string): void {
    if (!this.socket?.connected) {
      console.log(
        "Socket not connected when trying to mark notification as read"
      );
      return;
    }
    this.socket.emit("mark_notification_read", { notificationId });
  }

  deleteNotification(notificationId: string): void {
    if (!this.socket?.connected) {
      console.log("Socket not connected when trying to delete notification");
      return;
    }
    this.socket.emit("delete_notification", { notificationId });
  }

  markAllNotificationsAsRead(): void {
    if (!this.socket?.connected) {
      console.log(
        "Socket not connected when trying to mark all notifications as read"
      );
      return;
    }
    this.socket.emit("mark_all_notifications_read");
  }
}

export default new SocketService();

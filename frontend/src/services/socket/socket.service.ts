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
      return;
    }

    if (this.socket) {
      this.socket.connect();
      return;
    }

    const apiUrl =
      // import.meta.env.VITE_USER_BASE_URL || "https://localhost:7001";
      import.meta.env.VITE_USER_BASE_URL || "https://api.my-space.shop";

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
      if (reason === "io server disconnect" || reason === "transport close") {
        setTimeout(() => {
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
      this.notifyListeners("receive_message", message);
    });

    this.socket.on(
      "messages_seen",
      (data: { chatRoomId: string; recipientType: string }) => {
        this.notifyListeners("messages_seen", data);
      }
    );

    this.socket.on(
      "user_typing",
      (data: { chatRoomId: string; userId: string; isTyping: boolean }) => {
        this.notifyListeners("user_typing", data);
      }
    );

    this.socket.on(
      "new_message_notification",
      (data: { chatRoomId: string; message: IMessage }) => {
        this.notifyListeners("new_message_notification", data);
      }
    );

    // Online status listeners
    this.socket.on(
      "user_status_changed",
      (data: { userId: string; isOnline: boolean }) => {
        this.notifyListeners("user_status_changed", data);
      }
    );

    this.socket.on(
      "initial_online_users",
      (onlineUsers: Record<string, boolean>) => {
        this.notifyListeners("initial_online_users", onlineUsers);
      }
    );

    // Single notification listener for all types
    this.socket.on("new_notification", (notification: any) => {
      this.notifyListeners("new_notification", notification);
    });

    // Notification count update listener
    this.socket.on("notification_count_update", (data: { count: number }) => {
      this.notifyListeners("notification_count_update", data);
    });
  }

  // Methods for online status :-

  emitUserStatus(userId: string, role: string, isOnline: boolean): void {
    if (!this.socket?.connected) {
      // Save user details for reconnection
      this.userId = userId;
      this.userRole = role;
      this.connect();

      // Wait a moment before sending
      setTimeout(() => {
        this.socket?.emit("user_status", { userId, role, isOnline });
      }, 500);
      return;
    }

    this.socket.emit("user_status", { userId, role, isOnline });
  }

  joinRoom(userId: string, chatRoomId: string): void {
    if (!this.socket?.connected) {
      this.connect();

      // Wait a moment before joining
      setTimeout(() => {
        this.socket?.emit("join_room", { userId, chatRoomId });
      }, 500);
      return;
    }

    this.socket.emit("join_room", { userId, chatRoomId });
  }

  leaveRoom(userId: string, chatRoomId: string): void {
    if (!this.socket?.connected) {
      return;
    }

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
      this.connect();

      // Wait a moment before sending
      setTimeout(() => {
        this.socket?.emit("send_message", messageData);
      }, 500);
      return;
    }

    this.socket.emit("send_message", messageData);
  }

  markMessagesAsSeen(
    chatRoomId: string,
    recipientType: "user" | "provider"
  ): void {
    if (!this.socket?.connected) {
      return;
    }

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
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  disconnect(): void {
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
      return;
    }
    this.socket.emit("mark_notification_read", { notificationId });
  }

  deleteNotification(notificationId: string): void {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit("delete_notification", { notificationId });
  }

  markAllNotificationsAsRead(): void {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit("mark_all_notifications_read");
  }
}

export default new SocketService();

import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { Service } from "typedi";
import { messageService } from "../chat/message.service";
import { chatRoomService } from "../chat/chatRoom.service";
import redisClient from "../../../config/redisConfig";
import { IMessageService } from "../../interface/chat/message.service.interface";
import { IChatRoomService } from "../../interface/chat/chatRoom.service.interface";
import { notificationService } from "../notification/notification.service";
import { INotificationService } from "../../interface/notification/notification.service.interface";
import { S3Service } from "../s3/s3.service";
import IS3service from "../../interface/s3/s3.service.interface";
import { IBooking } from "../../../models/booking.model";

interface SocketNotification {
  recipient: string;
  title: string;
  message: string;
  type: string;
  // relatedId: string;
}

@Service()
export class SocketService {
  private io!: Server;
  private messageService: IMessageService;
  private chatRoomService: IChatRoomService;
  private notificationService: INotificationService;
  private onlineUsers: Map<string, { role: string; socketId: string }> =
    new Map();
  private s3Service: IS3service;

  constructor() {
    this.messageService = messageService;
    this.chatRoomService = chatRoomService;
    this.notificationService = notificationService;
    this.s3Service = S3Service;
  }

  initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "https://my-space.shop",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
      },
    });

    this.io.on("connection", this.handleConnection.bind(this));
    console.log("Socket.io server initialized");
  }

  private async handleConnection(socket: Socket): Promise<void> {
    // Handle user joining a chat room
    socket.on(
      "join_room",
      async (data: { userId: string; chatRoomId: string }) => {
        try {
          const { userId, chatRoomId } = data;
          socket.join(chatRoomId);

          // Store the mapping in Redis
          await redisClient.hSet(`user:${userId}`, "socketId", socket.id);
          await redisClient.hSet(`socket:${socket.id}`, "userId", userId);
          await redisClient.sAdd(`room:${chatRoomId}`, socket.id);
        } catch (error) {
          console.error("Error joining room:", error);
        }
      }
    );

    // Handle sending messages
    socket.on(
      "send_message",
      async (messageData: {
        chatRoomId: string;
        senderId: string;
        senderType: "user" | "provider";
        content: string;
        image?: string;
        replyToMessageId?: string;
        _id?: string;
      }) => {
        try {
          const {
            chatRoomId,
            senderId,
            senderType,
            content,
            image,
            replyToMessageId,
            _id,
          } = messageData;

          // Check if message already exists in database by ID
          let newMessage;
          if (_id) {
            // Message already exists, just get it from the database
            newMessage = await this.messageService.getMessageById(_id);

            // If message wasn't found (unlikely), create it
            if (!newMessage) {
              newMessage = await this.messageService.sendMessage(
                chatRoomId,
                senderId,
                senderType,
                content,
                image,
                replyToMessageId
              );
            }
          } else {
            // Message doesn't exist, create it
            newMessage = await this.messageService.sendMessage(
              chatRoomId,
              senderId,
              senderType,
              content,
              image,
              replyToMessageId
            );
          }

          // If the message has an image, generate a signed URL
          if (newMessage.image) {
            newMessage.image = await this.s3Service.generateSignedUrl(
              newMessage.image
            );
          }

          // Broadcast to room
          this.io.to(chatRoomId).emit("receive_message", newMessage);

          // Also notify the other user if they're not in the room
          const recipientType = senderType === "user" ? "provider" : "user";
          const chatRoom = await this.chatRoomService.getChatRoomById(
            chatRoomId
          );

          if (chatRoom) {
            const recipientId =
              recipientType === "user"
                ? chatRoom.userId.toString()
                : chatRoom.providerId.toString();

            // Get recipient's socket ID from Redis
            const recipientSocketId = await redisClient.hGet(
              `user:${recipientId}`,
              "socketId"
            );

            if (recipientSocketId) {
              // Check if recipient is in the room
              const isInRoom = await redisClient.sIsMember(
                `room:${chatRoomId}`,
                recipientSocketId
              );

              if (!isInRoom) {
                // Notify recipient about new message

                this.io.to(recipientSocketId).emit("new_message_notification", {
                  chatRoomId,
                  message: newMessage,
                });
              }
            }
          }
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    // Handle marking messages as seen
    socket.on(
      "mark_messages_seen",
      async (data: {
        chatRoomId: string;
        recipientType: "user" | "provider";
      }) => {
        try {
          const { chatRoomId, recipientType } = data;

          await this.messageService.markAllMessagesAsSeenInChatRoom(
            chatRoomId,
            recipientType
          );

          // Notify others in the room that messages were seen
          socket.to(chatRoomId).emit("messages_seen", {
            chatRoomId,
            recipientType,
          });
        } catch (error) {
          console.error("Error marking messages as seen:", error);
          socket.emit("error", { message: "Failed to mark messages as seen" });
        }
      }
    );

    // Handle user typing
    socket.on(
      "typing",
      (data: { chatRoomId: string; userId: string; isTyping: boolean }) => {
        socket.to(data.chatRoomId).emit("user_typing", data);
      }
    );

    // Handle user leaving a chat room
    socket.on(
      "leave_room",
      async (data: { userId: string; chatRoomId: string }) => {
        try {
          const { userId, chatRoomId } = data;
          socket.leave(chatRoomId);

          // Remove from Redis
          await redisClient.sRem(`room:${chatRoomId}`, socket.id);
        } catch (error) {
          console.error("Error leaving room:", error);
        }
      }
    );

    // Handle user status (online/offline)
    socket.on(
      "user_status",
      async (data: { userId: string; role: string; isOnline: boolean }) => {
        try {
          const { userId, role, isOnline } = data;

          if (isOnline) {
            // Store in memory map
            this.onlineUsers.set(userId, { role, socketId: socket.id });

            // Store in Redis for persistence
            await redisClient.hSet(`user:${userId}`, "socketId", socket.id);
            await redisClient.hSet(`user:${userId}`, "role", role);
            await redisClient.hSet(`user:${userId}`, "isOnline", "true");
            await redisClient.hSet(`socket:${socket.id}`, "userId", userId);

            // Add to online users set by role
            await redisClient.sAdd(`online:${role}`, userId);
          } else {
            // Remove from memory map
            this.onlineUsers.delete(userId);

            // Update Redis
            await redisClient.hSet(`user:${userId}`, "isOnline", "false");

            // Remove from online users set by role
            await redisClient.sRem(`online:${role}`, userId);
          }

          // Broadcast status change to all clients
          this.io.emit("user_status_changed", { userId, isOnline });
        } catch (error) {
          console.error("Error handling user status:", error);
        }
      }
    );

    // Send initial online users when a client connects
    try {
      // Get all online users from Redis
      const onlineUsers: Record<string, boolean> = {};

      // Get user roles we're interested in
      const userIds = await redisClient.sMembers("online:user");
      const providerIds = await redisClient.sMembers("online:provider");

      // Build online status map
      for (const userId of userIds) {
        onlineUsers[userId] = true;
      }

      for (const providerId of providerIds) {
        onlineUsers[providerId] = true;
      }

      // Send to newly connected client
      socket.emit("initial_online_users", onlineUsers);
    } catch (error) {
      console.error("Error getting initial online users:", error);
    }

    // Handle disconnection
    socket.on("disconnect", async () => {
      try {
        // Get user ID associated with this socket
        const userId = await redisClient.hGet(`socket:${socket.id}`, "userId");

        if (userId) {
          // Get user role
          const role =
            (await redisClient.hGet(`user:${userId}`, "role")) || "user";

          // Mark as offline in Redis
          await redisClient.hSet(`user:${userId}`, "isOnline", "false");

          // Remove from online users set by role
          await redisClient.sRem(`online:${role}`, userId);

          // Remove from memory map
          this.onlineUsers.delete(userId);

          // Broadcast status change
          this.io.emit("user_status_changed", { userId, isOnline: false });
        }

        // Clean up Redis
        await redisClient.del(`socket:${socket.id}`);

        // Find all rooms this socket was in and remove it
        const allRoomKeys = await redisClient.keys("room:*");
        for (const roomKey of allRoomKeys) {
          await redisClient.sRem(roomKey, socket.id);
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });

    // Handle global user connection (for notifications)
    socket.on("user_connected", async (data: { userId: string }) => {
      try {
        const { userId } = data;

        // Store user's socket ID in Redis
        await redisClient.hSet(`user:${userId}`, "socketId", socket.id);
        await redisClient.hSet(`socket:${socket.id}`, "userId", userId);

        // You can emit pending notifications here
        // For example, unread message counts, etc.
      } catch (error) {
        console.error("Error handling user connection:", error);
      }
    });

    // Handle global user disconnection
    socket.on("user_disconnected", async (data: { userId: string }) => {
      try {
        const { userId } = data;

        // Clean up Redis entries
        await redisClient.del(`user:${userId}`);
      } catch (error) {
        console.error("Error handling user disconnection:", error);
      }
    });

    // Handle notification read
    socket.on(
      "mark_notification_read",
      async (data: { notificationId: string }) => {
        try {
          const { notificationId } = data;
          await this.notificationService.updateNotification(notificationId, {
            isRead: true,
          });
          socket.emit("notification_read", { notificationId });

          // Get updated count and emit
          const userId = await redisClient.hGet(
            `socket:${socket.id}`,
            "userId"
          );
          if (userId) {
            const count = await this.notificationService.getUnreadCount(userId);
            socket.emit("notification_count_update", { count });
          }
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      }
    );

    // Add these new event handlers
    socket.on("delete_notification", async ({ notificationId }) => {
      try {
        await this.notificationService.updateNotification(notificationId, {
          isDeleted: true,
        });
        socket.emit("notification_deleted", { notificationId });
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    });

    socket.on("mark_all_notifications_read", async () => {
      try {
        const userId = await redisClient.hGet(`socket:${socket.id}`, "userId");
        if (userId) {
          await this.notificationService.markAllNotificationsAsRead(userId);
          socket.emit("all_notifications_read");
          socket.emit("notification_count_update", { count: 0 });
        }
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      }
    });
  }

  // Method to emit events to specific users or rooms
  emitToUser(userId: string, event: string, data: unknown): void {
    redisClient
      .hGet(`user:${userId}`, "socketId")
      .then((socketId) => {
        if (socketId) {
          this.io.to(socketId).emit(event, data);
        }
      })
      .catch((err) => console.error("Error emitting to user:", err));
  }

  emitToRoom(roomId: string, event: string, data: unknown): void {
    this.io.to(roomId).emit(event, data);
  }

  // Add method to emit notifications
  emitNotification(recipientId: string, notification: SocketNotification): void {
    redisClient
      .hGet(`user:${recipientId}`, "socketId")
      .then(async (socketId) => {
        if (socketId) {
          // Emit the notification
          this.io.to(socketId).emit("new_notification", notification);

          // Get and emit updated count
          const count = await this.notificationService.getUnreadCount(
            recipientId
          );
          this.io.to(socketId).emit("notification_count_update", { count });
        }
      })
      .catch((err) => console.error("Error emitting notification:", err));
  }

  // Add these methods to emit notifications for different events
  emitNewBooking(booking: IBooking, providerId: string): void {
    const notification: SocketNotification = {
      recipient: providerId,
      title: "New Booking Request",
      message: `You have received a new booking request for ${booking.hostelId}`,
      type: "booking",
    };
    this.emitNotification(providerId, notification);
  }

  emitBookingCancelled(booking: IBooking, providerId: string): void {
    const notification: SocketNotification = {
      recipient: providerId,
      title: "Booking Cancelled",
      message: `A booking for ${booking.hostelId} has been cancelled`,
      type: "booking",
    };
    this.emitNotification(providerId, notification);
  }

  emitBookingStatusUpdate(booking: IBooking, userId: string): void {
    const notification: SocketNotification = {
      recipient: userId,
      title: "Booking Status Updated",
      message: `Your booking status has been updated to ${booking.paymentStatus}`,
      type: "booking",
    };
    this.emitNotification(userId, notification);
  }
}

export default new SocketService();

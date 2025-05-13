import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { Service } from "typedi";
import { messageService } from "../chat/message.service";
import { chatRoomService } from "../chat/chatRoom.service";
import redisClient from "../../../config/redisConfig";
import { IMessageService } from "../../interface/chat/message.service.interface";
import { IChatRoomService } from "../../interface/chat/chatRoom.service.interface";

@Service()
export class SocketService {
  private io!: Server;
  private messageService: IMessageService;
  private chatRoomService: IChatRoomService;
  private onlineUsers: Map<string, { role: string; socketId: string }> =
    new Map();

  constructor() {
    this.messageService = messageService;
    this.chatRoomService = chatRoomService;
  }

  initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5000",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
      },
    });

    this.io.on("connection", this.handleConnection.bind(this));
    console.log("Socket.io server initialized");
  }

  private async handleConnection(socket: Socket): Promise<void> {
    console.log(`New client connected: ${socket.id}`);

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

          console.log(`User ${userId} joined room ${chatRoomId}`);
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

          // Broadcast to room
          // console.log(
          //   `Broadcasting message to room ${chatRoomId}:`,
          //   newMessage
          // );
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
                console.log(
                  `Notifying user ${recipientId} about new message:`,
                  newMessage
                );
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
          console.log(`User ${userId} left room ${chatRoomId}`);
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
          console.log(
            `User ${userId} is now ${isOnline ? "online" : "offline"}`
          );

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

        console.log(`Client disconnected: ${socket.id}`);
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });

    // Handle global user connection (for notifications)
    socket.on("user_connected", async (data: { userId: string }) => {
      try {
        const { userId } = data;
        console.log(`User ${userId} connected globally`);

        // Store user's socket ID in Redis
        await redisClient.hSet(`user:${userId}`, "socketId", socket.id);
        await redisClient.hSet(`socket:${socket.id}`, "userId", userId);

        // You can emit any pending notifications here
        // For example, unread message counts, etc.
      } catch (error) {
        console.error("Error handling user connection:", error);
      }
    });

    // Handle global user disconnection
    socket.on("user_disconnected", async (data: { userId: string }) => {
      try {
        const { userId } = data;
        console.log(`User ${userId} disconnected globally`);

        // Clean up Redis entries
        await redisClient.del(`user:${userId}`);
      } catch (error) {
        console.error("Error handling user disconnection:", error);
      }
    });
  }

  // Method to emit events to specific users or rooms
  emitToUser(userId: string, event: string, data: any): void {
    redisClient
      .hGet(`user:${userId}`, "socketId")
      .then((socketId) => {
        if (socketId) {
          this.io.to(socketId).emit(event, data);
        }
      })
      .catch((err) => console.error("Error emitting to user:", err));
  }

  emitToRoom(roomId: string, event: string, data: any): void {
    this.io.to(roomId).emit(event, data);
  }
}

export default new SocketService();

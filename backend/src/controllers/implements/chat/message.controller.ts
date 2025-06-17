import Container, { Service } from "typedi";
import { Request, Response } from "express";
import { messageService } from "../../../services/implements/chat/message.service";
import { Types } from "mongoose";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { IMessageService } from "../../../services/interface/chat/message.service.interface";
import { S3Service } from "../../../services/implements/s3/s3.service";
import IS3service from "../../../services/interface/s3/s3.service.interface";

@Service()
export class MessageController {
  private messageService: IMessageService;
  private s3Service: IS3service;

  constructor() {
    this.messageService = messageService;
    this.s3Service = S3Service;
  }

  //   Send message :-

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        chatRoomId,
        senderId,
        senderType,
        content,
        image,
        replyToMessageId,
      } = req.body;

      if (!chatRoomId || !senderId || !senderType || !content) {
        throw new AppError(
          "chatRoomId, senderId, senderType, and content are required",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!["user", "provider"].includes(senderType)) {
        throw new AppError(
          "senderType must be either 'user' or 'provider'",
          HttpStatus.BAD_REQUEST
        );
      }

      const message = await this.messageService.sendMessage(
        chatRoomId,
        senderId,
        senderType,
        content,
        image,
        replyToMessageId
      );

      res.status(HttpStatus.CREATED).json({
        success: true,
        message,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "An error occurred while sending the message",
        });
      }
    }
  };

  //  Get chat messages's :-

  getChatMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { chatRoomId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!chatRoomId || !Types.ObjectId.isValid(chatRoomId)) {
        throw new AppError(
          "Valid chatRoomId is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const messages = await this.messageService.getChatMessages(
        chatRoomId,
        page,
        limit
      );

      res.status(HttpStatus.OK).json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error("Error getting chat messages:", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "An error occurred while retrieving chat messages",
        });
      }
    }
  };

  //  Mark message seen :-

  markMessagesAsSeen = async (req: Request, res: Response): Promise<void> => {
    try {
      const { chatRoomId } = req.params;
      const { recipientType } = req.body;

      if (!chatRoomId || !Types.ObjectId.isValid(chatRoomId)) {
        throw new AppError(
          "Valid chatRoomId is required",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!recipientType || !["user", "provider"].includes(recipientType)) {
        throw new AppError(
          "recipientType must be either 'user' or 'provider'",
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.messageService.markAllMessagesAsSeenInChatRoom(
        chatRoomId,
        recipientType
      );

      res.status(HttpStatus.OK).json({
        success: true,
        messagesMarkedAsSeen: result,
      });
    } catch (error) {
      console.error("Error marking messages as seen:", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "An error occurred while marking messages as seen",
        });
      }
    }
  };

  //  Get all msg un-read count :-

  getUnreadMessageCount = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { chatRoomId } = req.params;
      const { recipientType } = req.query;

      if (!chatRoomId || !Types.ObjectId.isValid(chatRoomId)) {
        throw new AppError(
          "Valid chatRoomId is required",
          HttpStatus.BAD_REQUEST
        );
      }

      if (
        !recipientType ||
        !["user", "provider"].includes(recipientType as string)
      ) {
        throw new AppError(
          "recipientType must be either 'user' or 'provider'",
          HttpStatus.BAD_REQUEST
        );
      }

      const count = await this.messageService.getUnreadMessageCount(
        chatRoomId,
        recipientType as "user" | "provider"
      );

      res.status(HttpStatus.OK).json({
        success: true,
        unreadCount: count,
      });
    } catch (error) {
      console.error("Error getting unread message count:", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "An error occurred while getting unread message count",
        });
      }
    }
  };

  //  Upload image in message :-

  uploadMessageImage = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        throw new AppError("No image file provided", HttpStatus.BAD_REQUEST);
      }

      const { chatRoomId, senderId, senderType, replyToMessageId } = req.body;

      if (!chatRoomId || !senderId || !senderType) {
        throw new AppError(
          "chatRoomId, senderId, and senderType are required",
          HttpStatus.BAD_REQUEST
        );
      }

      const uploadResult = await this.s3Service.uploadFile(
        req.file,
        "chat-images"
      );
      if (
        !uploadResult ||
        !("Location" in uploadResult) ||
        Array.isArray(uploadResult)
      ) {
        throw new AppError(
          "Failed to upload image",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const message = await this.messageService.sendMessage(
        chatRoomId,
        senderId,
        senderType,
        "", // Empty content for image-only messages
        uploadResult.Location,
        replyToMessageId
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "An error occurred while uploading the image",
        });
      }
    }
  };
}

export const messageController = Container.get(MessageController);

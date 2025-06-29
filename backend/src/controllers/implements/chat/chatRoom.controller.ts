import Container, { Service } from "typedi";
import { Request, Response } from "express";
import { chatRoomService } from "../../../services/implements/chat/chatRoom.service";
import { Types } from "mongoose";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { S3Service } from "../../../services/implements/s3/s3.service";
import IS3service from "../../../services/interface/s3/s3.service.interface";
import { IChatRoomService } from "../../../services/interface/chat/chatRoom.service.interface";

interface PopulatedProfile {
  profile_picture?: string;
  [key: string]: any;
}

@Service()
export class ChatRoomController {
  private chatRoomService: IChatRoomService;
  private s3Service: IS3service;

  constructor() {
    this.chatRoomService = chatRoomService;
    this.s3Service = S3Service;
  }

  //  Create chat room :-

  createChatRoom = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, providerId } = req.body;

      if (!userId || !providerId) {
        throw new AppError(
          "Both userId and providerId are required",
          HttpStatus.BAD_REQUEST
        );
      }

      const chatRoom = await this.chatRoomService.createChatRoom(
        userId,
        providerId
      );

      return res.status(HttpStatus.CREATED).json({
        success: true,
        chatRoom,
      });
    } catch (error) {
      console.error("Error creating chat room:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "An error occurred while creating the chat room",
        });
      }
    }
  };

  //  Get chat room :-

  getChatRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const { chatRoomId } = req.params;

      if (!chatRoomId || !Types.ObjectId.isValid(chatRoomId)) {
        throw new AppError(
          "Valid chatRoomId is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const chatRoom = await this.chatRoomService.getChatRoomById(chatRoomId);

      if (!chatRoom) {
        throw new AppError("Chat room not found", HttpStatus.NOT_FOUND);
      }

      // Check if userId and providerId are populated objects before accessing their properties :-

      const result = { ...chatRoom };

      // Check if userId is populated :-

      if (
        result.userId &&
        typeof result.userId === "object" &&
        "profile_picture" in result.userId
      ) {
        const userProfile = result.userId as PopulatedProfile;
        if (userProfile && userProfile.profile_picture) {
          userProfile.profilePicture = await this.s3Service.generateSignedUrl(
            userProfile.profile_picture
          );
        }
      }

      // Check if providerId is populated :-

      if (
        result.providerId &&
        typeof result.providerId === "object" &&
        "profile_picture" in result.providerId
      ) {
        const providerProfile = result.providerId as PopulatedProfile;
        if (providerProfile && providerProfile.profile_picture) {
          providerProfile.profilePicture =
            await this.s3Service.generateSignedUrl(
              providerProfile.profile_picture
            );
        }
      }

      res.status(HttpStatus.OK).json({
        success: true,
        chatRoom: result,
      });
    } catch (error) {
      console.error("Error getting chat room:", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "An error occurred while retrieving the chat room",
        });
      }
    }
  };

  //  GetAll user chat room's :-

  getUserChatRooms = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.params;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId || !Types.ObjectId.isValid(userId)) {
        throw new AppError("Valid userId is required", HttpStatus.BAD_REQUEST);
      }

      const chatRooms = await this.chatRoomService.getUserChatRooms(
        userId,
        page,
        limit
      );

      const roomsWithSignedUrls = await Promise.all(
        chatRooms.map(async (room) => {
          const result = { ...room };

          // If providerId is populated :-

          if (
            result.providerId &&
            typeof result.providerId === "object" &&
            "profile_picture" in result.providerId
          ) {
            const providerProfile = result.providerId as PopulatedProfile;
            if (providerProfile && providerProfile.profile_picture) {
              providerProfile.profilePicture =
                await this.s3Service.generateSignedUrl(
                  providerProfile.profile_picture
                );
            }
          }

          //  If userId is populated :-

          if (
            result.userId &&
            typeof result.userId === "object" &&
            "profile_picture" in result.userId
          ) {
            const userProfile = result.userId as PopulatedProfile;
            if (userProfile && userProfile.profile_picture) {
              userProfile.profilePicture =
                await this.s3Service.generateSignedUrl(
                  userProfile.profile_picture
                );
            }
          }

          return result;
        })
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        chatRooms: roomsWithSignedUrls,
      });
    } catch (error) {
      console.error("Error getting user chat rooms:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "An error occurred while retrieving user chat rooms",
        });
      }
    }
  };

  //  GetAll provider chat room's :-

  getProviderChatRooms = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { providerId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!providerId || !Types.ObjectId.isValid(providerId)) {
        throw new AppError(
          "Valid providerId is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const chatRooms = await this.chatRoomService.getProviderChatRooms(
        providerId,
        page,
        limit
      );

      const roomsWithSignedUrls = await Promise.all(
        chatRooms.map(async (room) => {
          const result = { ...room };

          if (
            result.userId &&
            typeof result.userId === "object" &&
            "profile_picture" in result.userId
          ) {
            const userProfile = result.userId as PopulatedProfile;
            if (userProfile && userProfile.profile_picture) {
              userProfile.profilePicture =
                await this.s3Service.generateSignedUrl(
                  userProfile.profile_picture
                );
            }
          }

          if (
            result.providerId &&
            typeof result.providerId === "object" &&
            "profile_picture" in result.providerId
          ) {
            const providerProfile = result.providerId as PopulatedProfile;
            if (providerProfile && providerProfile.profile_picture) {
              providerProfile.profilePicture =
                await this.s3Service.generateSignedUrl(
                  providerProfile.profile_picture
                );
            }
          }

          return result;
        })
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        chatRooms: roomsWithSignedUrls,
      });
    } catch (error) {
      console.error("Error getting provider chat rooms:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "An error occurred while retrieving provider chat rooms",
        });
      }
    }
  };

  //  Soon :-

  deleteChatRoom = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { chatRoomId } = req.params;

      if (!chatRoomId || !Types.ObjectId.isValid(chatRoomId)) {
        throw new AppError(
          "Valid chatRoomId is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const deleted = await this.chatRoomService.deleteChatRoom(chatRoomId);

      if (!deleted) {
        throw new AppError(
          "Chat room not found or already deleted",
          HttpStatus.NOT_FOUND
        );
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Chat room deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting chat room:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "An error occurred while deleting the chat room",
        });
      }
    }
  };
}

export const chatRoomController = Container.get(ChatRoomController);

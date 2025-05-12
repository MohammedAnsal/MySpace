import Container, { Service } from "typedi";
import { Request, Response } from "express";
import { ChatRoomService } from "../../../services/implements/chat/chatRoom.service";
import { Types } from "mongoose";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";

@Service()
export class ChatRoomController {
    private chatRoomService: ChatRoomService;

    constructor() {
        this.chatRoomService = new ChatRoomService();
    }

    // Create or get a chat room
    createChatRoom = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId, providerId } = req.body;

            if (!userId || !providerId) {
                throw new AppError("Both userId and providerId are required", HttpStatus.BAD_REQUEST);
            }

            const chatRoom = await this.chatRoomService.createChatRoom(userId, providerId);
            
            res.status(HttpStatus.CREATED).json({
                success: true,
                chatRoom
            });
        } catch (error) {
            console.error("Error creating chat room:", error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "An error occurred while creating the chat room"
                });
            }
        }
    }

    // Get chat room by ID
    getChatRoom = async (req: Request, res: Response): Promise<void> => {
        try {
            const { chatRoomId } = req.params;

            if (!chatRoomId || !Types.ObjectId.isValid(chatRoomId)) {
                throw new AppError("Valid chatRoomId is required", HttpStatus.BAD_REQUEST);
            }

            const chatRoom = await this.chatRoomService.getChatRoomById(chatRoomId);
            
            if (!chatRoom) {
                throw new AppError("Chat room not found", HttpStatus.NOT_FOUND);
            }

            res.status(HttpStatus.OK).json({
                success: true,
                chatRoom
            });
        } catch (error) {
            console.error("Error getting chat room:", error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "An error occurred while retrieving the chat room"
                });
            }
        }
    }

    // Get user's chat rooms
    getUserChatRooms = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            if (!userId || !Types.ObjectId.isValid(userId)) {
                throw new AppError("Valid userId is required", HttpStatus.BAD_REQUEST);
            }

            const chatRooms = await this.chatRoomService.getUserChatRooms(userId, page, limit);

            res.status(HttpStatus.OK).json({
                success: true,
                chatRooms
            });
        } catch (error) {
            console.error("Error getting user chat rooms:", error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "An error occurred while retrieving user chat rooms"
                });
            }
        }
    }

    // Get provider's chat rooms
    getProviderChatRooms = async (req: Request, res: Response): Promise<void> => {
        try {
            const { providerId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            if (!providerId || !Types.ObjectId.isValid(providerId)) {
                throw new AppError("Valid providerId is required", HttpStatus.BAD_REQUEST);
            }

            const chatRooms = await this.chatRoomService.getProviderChatRooms(providerId, page, limit);

            res.status(HttpStatus.OK).json({
                success: true,
                chatRooms
            });
        } catch (error) {
            console.error("Error getting provider chat rooms:", error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "An error occurred while retrieving provider chat rooms"
                });
            }
        }
    }

    // Delete a chat room
    deleteChatRoom = async (req: Request, res: Response): Promise<void> => {
        try {
            const { chatRoomId } = req.params;

            if (!chatRoomId || !Types.ObjectId.isValid(chatRoomId)) {
                throw new AppError("Valid chatRoomId is required", HttpStatus.BAD_REQUEST);
            }

            const deleted = await this.chatRoomService.deleteChatRoom(chatRoomId);
            
            if (!deleted) {
                throw new AppError("Chat room not found or already deleted", HttpStatus.NOT_FOUND);
            }

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Chat room deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting chat room:", error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "An error occurred while deleting the chat room"
                });
            }
        }
    }
}

export const chatRoomController = Container.get(ChatRoomController);

import express from "express";
import { chatRoomController } from "../../controllers/implements/chat/chatRoom.controller";
import { messageController } from "../../controllers/implements/chat/message.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { upload } from "../../utils/multer";
import { asyncHandler } from "../../utils/asyncHandler";

const chatRoute = express.Router();

// Chat Room routes
chatRoute.post(
  "/rooms",
  asyncHandler(chatRoomController.createChatRoom.bind(chatRoomController))
);
chatRoute.get(
  "/rooms/:chatRoomId",
  asyncHandler(chatRoomController.getChatRoom.bind(chatRoomController))
);
chatRoute.get(
  "/users/:userId/rooms",
  asyncHandler(chatRoomController.getUserChatRooms.bind(chatRoomController))
);
chatRoute.get(
  "/providers/:providerId/rooms",
  asyncHandler(chatRoomController.getProviderChatRooms.bind(chatRoomController))
);
chatRoute.delete(
  "/rooms/:chatRoomId",
  asyncHandler(chatRoomController.deleteChatRoom.bind(chatRoomController))
);

// Message routes
chatRoute.post(
  "/messages",
  asyncHandler(messageController.sendMessage.bind(messageController))
);
chatRoute.get(
  "/rooms/:chatRoomId/messages",
  asyncHandler(messageController.getChatMessages.bind(messageController))
);
chatRoute.patch(
  "/rooms/:chatRoomId/messages/seen",
  asyncHandler(messageController.markMessagesAsSeen.bind(messageController))
);
chatRoute.get(
  "/rooms/:chatRoomId/unread",
  asyncHandler(messageController.getUnreadMessageCount.bind(messageController))
);

chatRoute.post(
  "/messages/upload-image",
  upload.single("image"),
  asyncHandler(messageController.uploadMessageImage.bind(messageController))
);

export default chatRoute;

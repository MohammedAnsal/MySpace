import express from "express";
import { chatRoomController } from "../../controllers/implements/chat/chatRoom.controller";
import { messageController } from "../../controllers/implements/chat/message.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { upload } from "../../utils/multer";

const chatRoute = express.Router();

// Chat Room routes
chatRoute.post(
  "/rooms",
  chatRoomController.createChatRoom.bind(chatRoomController)
);
chatRoute.get(
  "/rooms/:chatRoomId",
  chatRoomController.getChatRoom.bind(chatRoomController)
);
chatRoute.get(
  "/users/:userId/rooms",
  chatRoomController.getUserChatRooms.bind(chatRoomController)
);
chatRoute.get(
  "/providers/:providerId/rooms",
  chatRoomController.getProviderChatRooms.bind(chatRoomController)
);
chatRoute.delete(
  "/rooms/:chatRoomId",
  chatRoomController.deleteChatRoom.bind(chatRoomController)
);

// Message routes
chatRoute.post(
  "/messages",
  messageController.sendMessage.bind(messageController)
);
chatRoute.get(
  "/rooms/:chatRoomId/messages",
  messageController.getChatMessages.bind(messageController)
);
chatRoute.patch(
  "/rooms/:chatRoomId/messages/seen",
  messageController.markMessagesAsSeen.bind(messageController)
);
chatRoute.get(
  "/rooms/:chatRoomId/unread",
  messageController.getUnreadMessageCount.bind(messageController)
);

chatRoute.post(
  "/messages/upload-image",
  upload.single("image"),
  messageController.uploadMessageImage.bind(messageController)
);

export default chatRoute;

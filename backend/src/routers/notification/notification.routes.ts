import express from "express";
import { notificationController } from "../../controllers/implements/notification/notification.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";

const notificationRouter = express.Router();

notificationRouter.use(authMiddleWare);
notificationRouter.use(autherization);

notificationRouter.post(
  "/",
  notificationController.createNotification.bind(notificationController)
);
notificationRouter.get(
  "/:id",
  notificationController.getNotificationById.bind(notificationController)
);
notificationRouter.put(
  "/:id",
  notificationController.updateNotification.bind(notificationController)
);
notificationRouter.delete(
  "/:id",
  notificationController.deleteNotification.bind(notificationController)
);
notificationRouter.get(
  "/recipient/:recipientId",
  notificationController.getNotificationsByRecipient.bind(
    notificationController
  )
);

export default notificationRouter;

import express from "express";
import { washingController } from "../../../controllers/implements/facility/washing/washing.controller";
import { authMiddleWare } from "../../../middlewares/auth/auth.middleware";
import { autherization } from "../../../middlewares/auth/autherization.middlware";

const washingRoute = express.Router();

// Apply middleware to all routes
washingRoute.use(authMiddleWare);
washingRoute.use(autherization);

// User routes
washingRoute.post(
  "/washing/create",
  washingController.createWashingRequest.bind(washingController)
);
washingRoute.get(
  "/washing/user",
  washingController.getUserWashingRequests.bind(washingController)
);
washingRoute.get(
  "/washing/:id",
  washingController.getWashingRequestById.bind(washingController)
);
washingRoute.post(
  "/washing/:id/cancel",
  washingController.cancelWashingRequest.bind(washingController)
);
washingRoute.post(
  "/washing/:id/feedback",
  washingController.addFeedback.bind(washingController)
);

// Provider routes
washingRoute.get(
  "/washing/provider/requests",
  washingController.getProviderWashingRequests.bind(washingController)
);
washingRoute.put(
  "/washing/:id/status",
  washingController.updateWashingRequestStatus.bind(washingController)
);

export default washingRoute;

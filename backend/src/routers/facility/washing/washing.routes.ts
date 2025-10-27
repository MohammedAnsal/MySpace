import express from "express";
import { washingController } from "../../../controllers/implements/facility/washing/washing.controller";
import { authMiddleWare } from "../../../middlewares/auth/auth.middleware";
import { autherization } from "../../../middlewares/auth/autherization.middlware";
import { asyncHandler } from "../../../utils/asyncHandler";

const washingRoute = express.Router();

washingRoute.use(authMiddleWare);
washingRoute.use(autherization);

// User routes :-

washingRoute.post(
  "/washing/create",
  asyncHandler(washingController.createWashingRequest.bind(washingController))
);
washingRoute.get(
  "/washing/user",
  asyncHandler(washingController.getUserWashingRequests.bind(washingController))
);
washingRoute.get(
  "/washing/:id",
  asyncHandler(washingController.getWashingRequestById.bind(washingController))
);
washingRoute.patch(
  "/washing/:id/cancel",
  asyncHandler(washingController.cancelWashingRequest.bind(washingController))
);

// Provider routes:-

washingRoute.get(
  "/washing/provider/requests",
  asyncHandler(
    washingController.getProviderWashingRequests.bind(washingController)
  )
);
washingRoute.patch(
  "/washing/:id/status",
  asyncHandler(
    washingController.updateWashingRequestStatus.bind(washingController)
  )
);

export default washingRoute;

import express from "express";
import { cleaningController } from "../../../controllers/implements/facility/cleaning/cleaning.controller";
import { authMiddleWare } from "../../../middlewares/auth/auth.middleware";
import { autherization } from "../../../middlewares/auth/autherization.middlware";
import { asyncHandler } from "../../../utils/asyncHandler";

const cleaningRoute = express.Router();

cleaningRoute.use(authMiddleWare);
cleaningRoute.use(autherization);

// User routes:-

cleaningRoute.post(
  "/cleaning/create",
  asyncHandler(
    cleaningController.createCleaningRequest.bind(cleaningController)
  )
);
cleaningRoute.get(
  "/cleaning/user",
  asyncHandler(
    cleaningController.getUserCleaningRequests.bind(cleaningController)
  )
);
cleaningRoute.get(
  "/cleaning/:id",
  asyncHandler(
    cleaningController.getCleaningRequestById.bind(cleaningController)
  )
);
cleaningRoute.patch(
  "/cleaning/:id/cancel",
  asyncHandler(
    cleaningController.cancelCleaningRequest.bind(cleaningController)
  )
);

// Provider routes :-

cleaningRoute.get(
  "/cleaning/provider/requests",
  asyncHandler(
    cleaningController.getProviderCleaningRequests.bind(cleaningController)
  )
);
cleaningRoute.patch(
  "/cleaning/:id/status",
  asyncHandler(
    cleaningController.updateCleaningRequestStatus.bind(cleaningController)
  )
);

export default cleaningRoute;

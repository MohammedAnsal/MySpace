import express from "express";
import { cleaningController } from "../../../controllers/implements/facility/cleaning/cleaning.controller";
import { authMiddleWare } from "../../../middlewares/auth/auth.middleware";
import { autherization } from "../../../middlewares/auth/autherization.middlware";

const cleaningRoute = express.Router();

// Apply middleware to all routes
cleaningRoute.use(authMiddleWare);
cleaningRoute.use(autherization);

// User routes
cleaningRoute.post(
  "/cleaning/create",
  cleaningController.createCleaningRequest.bind(cleaningController)
);
cleaningRoute.get(
  "/cleaning/user",
  cleaningController.getUserCleaningRequests.bind(cleaningController)
);
cleaningRoute.get(
  "/cleaning/:id",
  cleaningController.getCleaningRequestById.bind(cleaningController)
);
cleaningRoute.post(
  "/cleaning/:id/cancel",
  cleaningController.cancelCleaningRequest.bind(cleaningController)
);
cleaningRoute.post(
  "/cleaning/:id/feedback",
  cleaningController.addFeedback.bind(cleaningController)
);

// Provider routes
cleaningRoute.get(
  "/cleaning/provider/requests",
  cleaningController.getProviderCleaningRequests.bind(cleaningController)
);
cleaningRoute.put(
  "/cleaning/:id/status",
  cleaningController.updateCleaningRequestStatus.bind(cleaningController)
);

export default cleaningRoute;

import express from "express";
import { ratingController } from "../../controllers/implements/user/rating.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";
import { asyncHandler } from "../../utils/asyncHandler";

const ratingRoute = express.Router();

ratingRoute.post(
  "/create-rating",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(ratingController.createRating.bind(ratingController))
);

ratingRoute.get(
  "/:hostelId/:bookingId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(ratingController.getUserRating.bind(ratingController))
);

export default ratingRoute;

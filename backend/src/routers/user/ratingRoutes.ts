import express from "express";
import { ratingController } from "../../controllers/implements/user/rating.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";

const ratingRoute = express.Router();

ratingRoute.post(
  "/create-rating",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  ratingController.createRating.bind(ratingController)
);

ratingRoute.get(
  "/:hostelId/:userId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  ratingController.getUserRating.bind(ratingController)
);

export default ratingRoute;

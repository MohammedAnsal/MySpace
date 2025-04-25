import { Router } from "express";
import { hostelController } from "../../controllers/implements/user/hostel.controller";
import { ratingController } from "../../controllers/implements/user/rating.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import Roles from "../../enums/roles";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";

const hostelRoute = Router();

hostelRoute.get(
  "/verified-hostels",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  hostelController.getVerifiedHostels.bind(hostelController)
);

hostelRoute.get(
  "/home-hostels",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  hostelController.getVerifiedHostelsForHome.bind(hostelController)
);

hostelRoute.get(
  "/hostel/:hostelId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  hostelController.getHostelById.bind(hostelController)
);

hostelRoute.get(
  "/hostel/:hostelId/ratings",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  ratingController.getHostelRatings.bind(ratingController)
);

hostelRoute.get(
  "/nearby-hostels",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  hostelController.getNearbyHostels.bind(hostelController)
);

export default hostelRoute;

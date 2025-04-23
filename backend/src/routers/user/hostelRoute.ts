import { Router } from "express";
import { hostelController } from "../../controllers/implements/user/hostel.controller";
import { ratingController } from "../../controllers/implements/user/rating.controller";

const hostelRoute = Router();

hostelRoute.get(
  "/verified-hostels",
  hostelController.getVerifiedHostels.bind(hostelController)
);

hostelRoute.get(
  "/home-hostels",
  hostelController.getVerifiedHostelsForHome.bind(hostelController)
);

hostelRoute.get(
  "/hostel/:hostelId",
  hostelController.getHostelById.bind(hostelController)
);

hostelRoute.get(
  "/hostel/:hostelId/ratings",
  ratingController.getHostelRatings.bind(ratingController)
);

hostelRoute.get(
  "/nearby-hostels",
  hostelController.getNearbyHostels.bind(hostelController)
);

export default hostelRoute;

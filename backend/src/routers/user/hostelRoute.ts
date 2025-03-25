import { Router } from "express";
import { hostelController } from "../../controllers/implements/user/hostel.controller";

const hostelRoute = Router();

hostelRoute.get(
  "/verified-hostels",
  hostelController.getVerifiedHostels.bind(hostelController)
);

hostelRoute.get(
  "/hostel/:hostelId",
  hostelController.getHostelById.bind(hostelController)
);

export default hostelRoute;

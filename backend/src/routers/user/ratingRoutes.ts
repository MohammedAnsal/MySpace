import express from "express";
import { ratingController } from "../../controllers/implements/user/rating.controller";

const ratingRoute = express.Router();

ratingRoute.post(
  "/create-rating",
  ratingController.createRating.bind(ratingController)
);

ratingRoute.get(
  "/:hostelId/:userId",
  ratingController.getUserRating.bind(ratingController)
);

export default ratingRoute;

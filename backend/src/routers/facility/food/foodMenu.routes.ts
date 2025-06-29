import express from "express";
import { foodMenuController } from "../../../controllers/implements/facility/food/foodMenu.controller";
import { authMiddleWare } from "../../../middlewares/auth/auth.middleware";
import { autherization } from "../../../middlewares/auth/autherization.middlware";
import { asyncHandler } from "../../../utils/asyncHandler";

const foodMenuRoute = express.Router();

foodMenuRoute.use(authMiddleWare);
foodMenuRoute.use(autherization);

foodMenuRoute.get(
  "/food-menu/:facilityId/:hostelId",
  asyncHandler(foodMenuController.getFoodMenu.bind(foodMenuController))
);

foodMenuRoute.put(
  "/food-menu/:id",
  asyncHandler(foodMenuController.updateFoodMenu.bind(foodMenuController))
);

foodMenuRoute.delete(
  "/food-menu/:id",
  asyncHandler(foodMenuController.deleteFoodMenu.bind(foodMenuController))
);

foodMenuRoute.post(
  "/food-menu/day",
  asyncHandler(foodMenuController.addSingleDayMenu.bind(foodMenuController))
);

foodMenuRoute.put(
  "/food-menu/:id/cancel-meal",
  asyncHandler(foodMenuController.cancelMeal.bind(foodMenuController))
);

export default foodMenuRoute;

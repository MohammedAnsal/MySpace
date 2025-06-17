import express from "express";
import { foodMenuController } from "../../../controllers/implements/facility/food/foodMenu.controller";
import { authMiddleWare } from "../../../middlewares/auth/auth.middleware";
import { autherization } from "../../../middlewares/auth/autherization.middlware";

const foodMenuRoute = express.Router();

foodMenuRoute.use(authMiddleWare);
foodMenuRoute.use(autherization);

foodMenuRoute.get(
  "/food-menu/:facilityId/:hostelId",
  foodMenuController.getFoodMenu.bind(foodMenuController)
);

foodMenuRoute.put(
  "/food-menu/:id",
  foodMenuController.updateFoodMenu.bind(foodMenuController)
);

foodMenuRoute.delete(
  "/food-menu/:id",
  foodMenuController.deleteFoodMenu.bind(foodMenuController)
);

foodMenuRoute.post(
  "/food-menu/day",
  foodMenuController.addSingleDayMenu.bind(foodMenuController)
);

foodMenuRoute.put(
  "/food-menu/:id/cancel-meal",
  foodMenuController.cancelMeal.bind(foodMenuController)
);

export default foodMenuRoute;

import express from "express";
import { menuItemController } from "../../../controllers/implements/facility/food/menuItem.controller";
import { upload } from "../../../utils/multer";
import { authMiddleWare } from "../../../middlewares/auth/auth.middleware";
import { autherization } from "../../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../../middlewares/auth/role.middleware";
import Roles from "../../../enums/roles";
import { asyncHandler } from "../../../utils/asyncHandler";

const menuItemRoute = express.Router();

menuItemRoute.use(authMiddleWare);
menuItemRoute.use(autherization);

menuItemRoute.post(
  "/menu-item/create",
  authorizeRoles(Roles.PROVIDER),
  upload.single("menuImage"),
  asyncHandler(menuItemController.createMenuItem.bind(menuItemController))
);

menuItemRoute.get(
  "/menu-item/all",
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(menuItemController.getAllMenuItems.bind(menuItemController))
);

menuItemRoute.get(
  "/menu-item/category/:category",
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(
    menuItemController.getMenuItemsByCategory.bind(menuItemController)
  )
);

menuItemRoute.get(
  "/menu-item/:id",
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(menuItemController.getMenuItem.bind(menuItemController))
);

menuItemRoute.put(
  "/menu-item/:id",
  authorizeRoles(Roles.PROVIDER),
  upload.single("image"),
  asyncHandler(menuItemController.updateMenuItem.bind(menuItemController))
);

menuItemRoute.delete(
  "/menu-item/:id",
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(menuItemController.deleteMenuItem.bind(menuItemController))
);

export default menuItemRoute;

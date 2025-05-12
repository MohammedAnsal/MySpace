import express from "express";
import { menuItemController } from "../../../controllers/implements/facility/food/menuItem.controller";
import { upload } from "../../../utils/multer";
import { authMiddleWare } from "../../../middlewares/auth/auth.middleware";
import { autherization } from "../../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../../middlewares/auth/role.middleware";
import Roles from "../../../enums/roles";

const menuItemRoute = express.Router();

menuItemRoute.use(authMiddleWare);
menuItemRoute.use(autherization);

menuItemRoute.post(
  "/menu-item/create",
  authorizeRoles(Roles.PROVIDER),
  upload.single("menuImage"),
  menuItemController.createMenuItem.bind(menuItemController)
);

menuItemRoute.get(
  "/menu-item/all",
  authorizeRoles(Roles.PROVIDER),
  menuItemController.getAllMenuItems.bind(menuItemController)
);

menuItemRoute.get(
  "/menu-item/category/:category",
  authorizeRoles(Roles.PROVIDER),
  menuItemController.getMenuItemsByCategory.bind(menuItemController)
);

menuItemRoute.get(
  "/menu-item/:id",
  authorizeRoles(Roles.PROVIDER),
  menuItemController.getMenuItem.bind(menuItemController)
);

menuItemRoute.put(
  "/menu-item/:id",
  authorizeRoles(Roles.PROVIDER),
  upload.single("image"),
  menuItemController.updateMenuItem.bind(menuItemController)
);

menuItemRoute.delete(
  "/menu-item/:id",
  authorizeRoles(Roles.PROVIDER),
  menuItemController.deleteMenuItem.bind(menuItemController)
);

export default menuItemRoute;

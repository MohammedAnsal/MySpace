import { Router } from "express";
import { userController } from "../../controllers/implements/user/user.controller";
import { upload } from "../../utils/multer";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { asyncHandler } from "../../utils/asyncHandler";

const userRoute = Router();

userRoute.get(
  "/profile",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(userController.findUser.bind(userController))
);
userRoute.post(
  "/change-password",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(userController.changePassword.bind(userController))
);

userRoute.put(
  "/edit-profile",
  upload.single("profile"),
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(userController.editProfile.bind(userController))
);

export default userRoute;

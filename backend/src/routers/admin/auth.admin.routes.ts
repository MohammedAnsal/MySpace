import { Router } from "express";
import { authController } from "../../controllers/implements/admin/auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const authAdminRoute = Router();

authAdminRoute.post(
  "/admin/sign-in",
  asyncHandler(authController.signIn.bind(authController))
);

authAdminRoute.post(
  "/admin/forgot-password",
  asyncHandler(authController.forgetPassword.bind(authController))
);

authAdminRoute.patch(
  "/admin/reset-password",
  asyncHandler(authController.resetPassword.bind(authController))
);

authAdminRoute.post(
  "/admin/logout",
  asyncHandler(authController.logout.bind(authController))
);

authAdminRoute.post(
  "/admin-refresh-token",
  asyncHandler(authController.setNewToken.bind(authController))
);

export default authAdminRoute;

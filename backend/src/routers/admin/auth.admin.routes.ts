import { Router } from "express";
import { authController } from "../../controllers/implements/admin/auth.controller";

const authAdminRoute = Router();

authAdminRoute.post(
  "/admin/sign-in",
  authController.signIn.bind(authController)
);

authAdminRoute.post(
  "/admin/forgot-password",
  authController.forgetPassword.bind(authController)
);

authAdminRoute.put(
  "/admin/reset-password",
  authController.resetPassword.bind(authController)
);

authAdminRoute.post(
  "/admin/logout",
  authController.logout.bind(authController)
);

authAdminRoute.get(
  "/admin-refresh-token",
  authController.setNewToken.bind(authController)
);

export default authAdminRoute;

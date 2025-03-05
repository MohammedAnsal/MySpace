import { Router } from "express";
import { authController } from "../../controllers/implements/admin/auth.controller";

const authAdminRoute = Router();

authAdminRoute.post(
  "/admin/sign-in",
  authController.signIn.bind(authController)
);
authAdminRoute.post("/logout", authController.logout.bind(authController));

authAdminRoute.get(
  "/admin-refresh-token",
  authController.setNewToken.bind(authController)
);

export default authAdminRoute;

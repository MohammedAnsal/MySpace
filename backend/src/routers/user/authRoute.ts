import { Router } from "express";
import { authController } from "../../controllers/implements/user/auth.controller";

const authRoute = Router();

authRoute.post("/sign-up", authController.signUp.bind(authController));
authRoute.post("/sign-in", authController.signIn.bind(authController));
authRoute.post("/verify-otp", authController.verifyOtp.bind(authController));
authRoute.post("/resend-otp", authController.resendOtp.bind(authController));
authRoute.post(
  "/forgot-password",
  authController.forgetPassword.bind(authController)
);

authRoute.put(
  "/reset-password",
  authController.resetPassword.bind(authController)
);

authRoute.get(
  "/refresh-token",
  authController.setNewToken.bind(authController)
);

authRoute.post(
  "/google-signIn",
  authController.googleSign.bind(authController)
);

authRoute.post("/logout", authController.logout.bind(authController));

export default authRoute;

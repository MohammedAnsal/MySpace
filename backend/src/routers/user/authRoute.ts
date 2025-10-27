import { Router } from "express";
import { authController } from "../../controllers/implements/user/auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const authRoute = Router();

authRoute.post(
  "/sign-up",
  asyncHandler(authController.signUp.bind(authController))
);
authRoute.post(
  "/sign-in",
  asyncHandler(authController.signIn.bind(authController))
);
authRoute.post(
  "/verify-otp",
  asyncHandler(authController.verifyOtp.bind(authController))
);
authRoute.post(
  "/resend-otp",
  asyncHandler(authController.resendOtp.bind(authController))
);
authRoute.post(
  "/forgot-password",
  asyncHandler(authController.forgetPassword.bind(authController))
);

authRoute.patch(
  "/reset-password",
  asyncHandler(authController.resetPassword.bind(authController))
);

authRoute.post(
  "/refresh-token",
  asyncHandler(authController.setNewToken.bind(authController))
);

authRoute.post(
  "/google-signIn",
  asyncHandler(authController.googleSign.bind(authController))
);

authRoute.post(
  "/logout",
  asyncHandler(authController.logout.bind(authController))
);

export default authRoute;

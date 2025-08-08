import { Router } from "express";
import { authController } from "../../controllers/implements/provider/auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { upload } from "../../utils/multer";

const authProviderRoute = Router();

authProviderRoute.post(
  "/provider/sign-up",
  upload.single("documentImage"),
  asyncHandler(authController.signUp.bind(authController))
);
authProviderRoute.post(
  "/provider/sign-in",
  asyncHandler(authController.signIn.bind(authController))
);

authProviderRoute.post(
  "/provider/verify-otp",
  asyncHandler(authController.verifyOtp.bind(authController))
);

authProviderRoute.post(
  "/provider/resend-otp",
  asyncHandler(authController.resendOtp.bind(authController))
);

authProviderRoute.post(
  "/provider/forgot-password",
  asyncHandler(authController.forgetPassword.bind(authController))
);

authProviderRoute.put(
  "/provider/reset-password",
  asyncHandler(authController.resetPassword.bind(authController))
);

authProviderRoute.post(
  "/provider/google-signIn",
  asyncHandler(authController.googleSign.bind(authController))
);

authProviderRoute.post(
  "/provider/logout",
  asyncHandler(authController.logout.bind(authController))
);

export default authProviderRoute;

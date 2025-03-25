import { Router } from "express";
import { authController } from "../../controllers/implements/provider/auth.controller";

const authProviderRoute = Router();

authProviderRoute.post(
  "/provider/sign-up",
  authController.signUp.bind(authController)
);
authProviderRoute.post(
  "/provider/sign-in",
  authController.signIn.bind(authController)
);

authProviderRoute.post(
  "/provider/verify-otp",
  authController.verifyOtp.bind(authController)
);

authProviderRoute.post(
  "/provider/resend-otp",
  authController.resendOtp.bind(authController)
);

authProviderRoute.post("/provider/logout", authController.logout.bind(authController));

export default authProviderRoute;

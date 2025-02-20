import { Router } from "express";
import { authController } from "../../controllers/implements/provider/auth.controller";

const authProviderRoute = Router();

authProviderRoute.post(
  "/provider-signUp",
  authController.signUp.bind(authController)
);
authProviderRoute.post(
  "/provider-signIn",
  authController.signIn.bind(authController)
);

authProviderRoute.post(
  "/provider-verifyOtp",
  authController.verifyOtp.bind(authController)
);

authProviderRoute.post(
  "/provider-resendOtp",
  authController.resendOtp.bind(authController)
);

export default authProviderRoute;

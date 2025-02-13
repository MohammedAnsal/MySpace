import { Router } from "express";
import { authController } from "../../controllers/implements/user/auth.controller";

const authRoute = Router();

authRoute.post("/sign-up", authController.signUp.bind(authController));
authRoute.post("/sign-in", authController.signIn.bind(authController));
authRoute.post("/verify-otp", authController.verifyOtp.bind(authController));
authRoute.post("/resend-otp", authController.resendOtp.bind(authController));

export default authRoute;

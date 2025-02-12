import { Router } from "express";
import { authController } from "../../controllers/implements/user/auth.controller";

const authRoute = Router();

authRoute.post("/signUp", authController.signUp.bind(authController));

export default authRoute;

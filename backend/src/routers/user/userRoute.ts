import { Router } from "express";
import { userController } from "../../controllers/implements/user/user.controller";

const userRoute = Router();

userRoute.post("/logout", userController.logout.bind(userController));

export default userRoute;

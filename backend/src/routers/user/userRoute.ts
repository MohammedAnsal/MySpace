import { Router } from "express";
import { userController } from "../../controllers/implements/user/user.controller";
import { upload } from "../../utils/multer";

const userRoute = Router();

userRoute.get("/profile", userController.findUser.bind(userController));
userRoute.post(
  "/change-password",
  userController.changePassword.bind(userController)
);

userRoute.put(
  "/edit-profile",
  upload.single("profile"),
  userController.editProfile.bind(userController)
);

export default userRoute;

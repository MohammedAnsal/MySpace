import { Request, Response } from "express";
import { UserService } from "../../../services/implements/user/user.service";
import { IUserController } from "../../interface/user/user.controller.inteface";
import { AppError } from "../../../utils/error";
import { HttpStatus, responseMessage } from "../../../enums/http.status";
import Container, { Service } from "typedi";
import { AuthRequset } from "../../../types/api";

@Service()
class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  async findUser(req: AuthRequset, res: Response): Promise<any> {
    try {
      const user = req.user?.id;
      const { success, data } = await this.userService.findUser(user as string);
      if (success) {
        res.status(HttpStatus.OK).json({ success: true, data });
      } else
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: responseMessage.ACCESS_DENIED });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in findUser:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async changePassword(req: Request, res: Response): Promise<any> {
    try {
      const { email, currentPassword, newPassword } = req.body;

      if (!email || !currentPassword || !newPassword) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email, current password, and new password are required.",
        });
      }

      const result = await this.userService.changePassword(
        email,
        currentPassword,
        newPassword
      );

      if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Error in changePassword controller:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  }

  async editProfile(req: AuthRequset, res: Response): Promise<any> {
    try {
      const formData = req.body;
      const profileImage = req.file;

      const userId = req.user?.id;

      if (!formData) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "User data is required.",
        });
      }

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      await this.userService.editProfile(
        formData,
        userId,
        profileImage ? profileImage : undefined
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Profile updated successfully.",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Error in editProfile controller:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  }
}

export const userController = Container.get(UserController);

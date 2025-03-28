import Container, { Service } from "typedi";
import { ProviderService } from "../../../services/implements/provider/provider.service";
import { IProviderController } from "../../interface/provider/provider.controller.interface";
import { Request, Response } from "express";
import { AuthRequset } from "../../../types/api";
import { HttpStatus, responseMessage } from "../../../enums/http.status";
import { AppError } from "../../../utils/error";

@Service()
export class ProviderController implements IProviderController {
  constructor(private readonly providerService: ProviderService) {}

  async findUser(req: AuthRequset, res: Response): Promise<any> {
    try {
      const user = req.user;
      
      const { success, data } = await this.providerService.findProvider(
        user as string
      );
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
      console.error("Error in findProvider:", error);
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

      const result = await this.providerService.changePassword(
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

      const userId = req.user;

      if (!formData) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "User data is required.",
        });
      }

      await this.providerService.editProfile(
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

export const providerController = Container.get(ProviderController);

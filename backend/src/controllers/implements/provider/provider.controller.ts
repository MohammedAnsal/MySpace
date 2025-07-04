import Container, { Service } from "typedi";
import { ProviderService } from "../../../services/implements/provider/provider.service";
import { IProviderController } from "../../interface/provider/provider.controller.interface";
import { Response } from "express";
import { AuthRequset } from "../../../types/api";
import { HttpStatus, responseMessage } from "../../../enums/http.status";
import { AppError } from "../../../utils/error";

@Service()
export class ProviderController implements IProviderController {
  constructor(private readonly providerService: ProviderService) {}

  //  Find provider profile :-

  async findUser(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const providerId = req.user?.id;

      if (!providerId) {
        throw new AppError(
          "Provider not authenticated",
          HttpStatus.UNAUTHORIZED
        );
      }

      const { success, data } = await this.providerService.findProvider(
        providerId as string
      );
      if (success) {
        return res.status(HttpStatus.OK).json({ success: true, data });
      } else
        return res
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

  //  Change password :-

  async changePassword(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const providerId = req.user?.id;

      if (!providerId) {
        throw new AppError(
          "Provider not authenticated",
          HttpStatus.UNAUTHORIZED
        );
      }

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

  //  Edit profile :-

  async editProfile(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const formData = req.body;
      const profileImage = req.file;
      const providerId = req.user?.id;

      if (!providerId) {
        throw new AppError(
          "Provider not authenticated",
          HttpStatus.UNAUTHORIZED
        );
      }

      if (!formData) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "User data is required.",
        });
      }

      await this.providerService.editProfile(
        formData,
        providerId,
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

  //  Get dashboard :-

  async getDashboard(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const providerId = req.user?.id;

      if (!providerId) {
        throw new AppError(
          "Provider not authenticated",
          HttpStatus.UNAUTHORIZED
        );
      }

      const getDashboardData = await this.providerService.getProviderDashboard(
        providerId as string
      );

      if (getDashboardData) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, getDashboardData });
      } else
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: responseMessage.ACCESS_DENIED });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in getDashboardData:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  Get all facility's :-

  async findAllFacilities(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const providerId = req.user?.id;

      if (!providerId) {
        throw new AppError(
          "Provider not authenticated",
          HttpStatus.UNAUTHORIZED
        );
      }

      const facilities = await this.providerService.findAllFacilities();

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Facilities fetched successfully",
        data: facilities,
      });
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch facilities",
      });
    }
  }
}

export const providerController = Container.get(ProviderController);

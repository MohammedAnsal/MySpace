import { Response } from "express";
import {
  adminService,
  AdminUserService,
} from "../../../services/implements/admin/user.admin.service";
import { IAdminController } from "../../interface/admin/admin.controller.interface";
import Container, { Service } from "typedi";
import { HttpStatus, responseMessage } from "../../../enums/http.status";
import { AuthRequset } from "../../../types/api";
import { IAdminUserService } from "../../../services/interface/admin/user.admin.service.interface";
import { AppError } from "../../../utils/error";
import { s3Service } from "../../../services/implements/s3/s3.service";
import { IHostel } from "../../../models/provider/hostel.model";

const AdminId = process.env.ADMIN_ID;

@Service()
class AdminUserController implements IAdminController {
  private adminServicee: IAdminUserService;
  private s3ServiceInstance = Container.get(s3Service);

  constructor(private userService: AdminUserService) {
    this.adminServicee = adminService;
  }

  //  Admin create wallet :-

  async createWallet(res: Response): Promise<Response> {
    try {
      if (!AdminId) {
        throw new AppError("Admin not authenticated", HttpStatus.UNAUTHORIZED);
      }
      const adminWallet = await this.userService.createWallet(AdminId);
      if (adminWallet) {
        return res.status(HttpStatus.OK).json(adminWallet);
      } else {
        throw new Error("failed to  fetch user");
      }
    } catch (walletError) {
      console.error("Error creating wallet for provider:", walletError);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  Find all user's :-

  async fetchUsers(req: AuthRequset, res: Response): Promise<Response> {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Admin not authenticated", HttpStatus.UNAUTHORIZED);
    }
    const searchQuery = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const getAllUsers = await this.userService.findAllUser({
      searchQuery,
      page,
      limit,
    });

    if (getAllUsers) {
      return res.status(HttpStatus.OK).json(getAllUsers);
    } else {
      throw new Error("failed to fetch user");
    }
  }

  //  Find all provider's :-

  async fetchProviders(req: AuthRequset, res: Response): Promise<Response> {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Admin not authenticated", HttpStatus.UNAUTHORIZED);
    }
    const searchQuery = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const getAllProviders = await this.userService.findAllProvider({
      searchQuery,
      page,
      limit,
    });

    if (getAllProviders) {
      return res.status(HttpStatus.OK).json(getAllProviders);
    } else {
      throw new Error("failed to fetch providers");
    }
  }

  //  Update user status :-

  async updateUser(req: AuthRequset, res: Response): Promise<Response> {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Admin not authenticated", HttpStatus.UNAUTHORIZED);
    }
    const { email } = req.body;

    const findUser = await this.userService.updateUser(email);

    if (findUser) {
      return res.status(HttpStatus.OK).json(findUser);
    } else {
      throw new Error("Error in updateUser");
    }
  }

  //  Verify hostel :-

  async verifyHostel(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Admin not authenticated", HttpStatus.UNAUTHORIZED);
      }
      const { hostelId, reason, isVerified, isRejected } = req.body;

      const result = await this.adminServicee.verifyHostel({
        hostelId,
        reason,
        isVerified,
        isRejected,
      });

      // Generate signed URLs for the verified/rejected hostel if data exists
      if (result.data) {
        const hostel = result.data as IHostel;
        const signedPhotos = await Promise.all(
          (hostel.photos || []).map((photo: string) =>
            this.s3ServiceInstance.generateSignedUrl(photo)
          )
        );

        const signedProof = hostel.property_proof
          ? await this.s3ServiceInstance.generateSignedUrl(
              hostel.property_proof
            )
          : "";

        const hostelWithSignedUrls = {
          ...hostel.toObject(),
          photos: signedPhotos,
          property_proof: signedProof,
        };

        return res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: hostelWithSignedUrls,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: null,
        });
      }
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to verify hostel",
        });
      }
    }
  }

  //  Find un-verified hostel's :-

  async getUnverifiedHostels(
    req: AuthRequset,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Admin not authenticated", HttpStatus.UNAUTHORIZED);
      }
      const result = await this.adminServicee.getUnverifiedHostels();

      if (result.data && Array.isArray(result.data)) {
        const hostelsWithSignedUrls = await Promise.all(
          result.data.map(async (hostel) => {
            const signedPhotos = await Promise.all(
              (hostel.photos || []).map((photo) =>
                this.s3ServiceInstance.generateSignedUrl(photo)
              )
            );

            const signedProof = hostel.property_proof
              ? await this.s3ServiceInstance.generateSignedUrl(
                  hostel.property_proof
                )
              : "";

            return {
              ...hostel.toObject(),
              photos: signedPhotos,
              property_proof: signedProof,
            };
          })
        );

        return res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: hostelsWithSignedUrls,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: [],
        });
      }
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch unverified hostels",
        });
      }
    }
  }

  //  Find verified hostel's :-

  async getVerifiedHostels(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Admin not authenticated", HttpStatus.UNAUTHORIZED);
      }
      const result = await this.adminServicee.getVerifiedHostels();

      if (result.data && Array.isArray(result.data)) {
        const hostelsWithSignedUrls = await Promise.all(
          result.data.map(async (hostel) => {
            const signedPhotos = await Promise.all(
              (hostel.photos || []).map((photo) =>
                this.s3ServiceInstance.generateSignedUrl(photo)
              )
            );

            const signedProof = hostel.property_proof
              ? await this.s3ServiceInstance.generateSignedUrl(
                  hostel.property_proof
                )
              : "";

            return {
              ...hostel.toObject(),
              photos: signedPhotos,
              property_proof: signedProof,
            };
          })
        );

        return res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: hostelsWithSignedUrls,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: [],
        });
      }
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch verified hostels",
        });
      }
    }
  }

  //  Find single hostel :-

  async getHostelById(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Admin not authenticated", HttpStatus.UNAUTHORIZED);
      }
      const { hostelId } = req.params;
      const result = await this.adminServicee.getHostelById(hostelId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch hostel details",
        });
      }
    }
  }

  //  Get dashboard :-

  async getDashboard(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Admin not authenticated", HttpStatus.UNAUTHORIZED);
      }
      const getDashboardData = await this.adminServicee.getAdminDashboard();

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

  //  Verify provider document :-

  async verifyProviderDocument(
    req: AuthRequset,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Admin not authenticated", HttpStatus.UNAUTHORIZED);
      }
      const { email } = req.body;

      if (!email) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Provider email is required",
        });
      }

      const result = await this.userService.verifyProviderDocument(email);

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      console.error("Error in verifyProviderDocument:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export const adminUserControllerr = Container.get(AdminUserController);

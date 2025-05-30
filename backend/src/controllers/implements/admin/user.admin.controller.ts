import { Request, Response } from "express";
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
import {
  s3Service,
  S3Service,
} from "../../../services/implements/s3/s3.service";
import { IHostel } from "../../../models/provider/hostel.model";

const AdminId = process.env.ADMIN_ID;

@Service()
class AdminUserController implements IAdminController {
  private adminServicee: IAdminUserService;
  private s3ServiceInstance = Container.get(s3Service);

  constructor(private userService: AdminUserService) {
    this.adminServicee = adminService;
  }

  async createWallet(req: AuthRequset, res: Response): Promise<any> {
    // Create wallet for provider after verification
    try {
      if (!AdminId) {
        throw new AppError("Admin not authenticated", 401);
      }
      const adminWallet = await this.userService.createWallet(AdminId);
       if (adminWallet) {
         return res.status(200).json(adminWallet);
       } else {
         throw new Error("failed to  fetch user");
       }
    } catch (walletError) {
      console.error("Error creating wallet for provider:", walletError);
      // Don't fail the verification process if wallet creation fails
    }
  }

  async fetchUsers(req: AuthRequset, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Admin not authenticated", 401);
    }
    const searchQuery = req.query.search as string;
    const getAllUsers = await this.userService.findAllUser(searchQuery);

    if (getAllUsers) {
      return res.status(200).json(getAllUsers);
    } else {
      throw new Error("failed to fetch user");
    }
  }

  async fetchProviders(req: AuthRequset, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Admin not authenticated", 401);
    }
    const searchQuery = req.query.search as string;
    const getAllProviders = await this.userService.findAllProvider(searchQuery);

    if (getAllProviders) {
      return res.status(200).json(getAllProviders);
    } else {
      throw new Error("failed to fetch providers");
    }
  }

  async updateUser(req: AuthRequset, res: Response): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Admin not authenticated", 401);
    }
    const { email } = req.body;

    const findUser = await this.userService.updateUser(email);

    if (findUser) {
      return res.status(200).json(findUser);
    } else {
      throw new Error("Error in updateUser");
    }
  }

  async verifyHostel(req: AuthRequset, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Admin not authenticated", 401);
      }
      const { hostelId, reason, isVerified, isRejected } = req.body;

      const result = await this.adminServicee.verifyHostel(
        hostelId,
        reason,
        isVerified,
        isRejected
      );

      // Generate signed URLs for the verified/rejected hostel if data exists
      if (result.data) {
        const hostel = result.data as IHostel;
        const signedPhotos = await Promise.all(
          (hostel.photos || []).map((photo: string) =>
            this.s3ServiceInstance.generateSignedUrl(photo)
          )
        );

        const hostelWithSignedUrls = {
          ...(hostel as any).toObject(),
          photos: signedPhotos,
        };

        res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: hostelWithSignedUrls,
        });
      } else {
        res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: null,
        });
      }
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to verify hostel",
        });
      }
    }
  }

  async getUnverifiedHostels(req: AuthRequset, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Admin not authenticated", 401);
      }
      const result = await this.adminServicee.getUnverifiedHostels();

      // Generate signed URLs for all hostel photos
      if (result.data && Array.isArray(result.data)) {
        const hostelsWithSignedUrls = await Promise.all(
          result.data.map(async (hostel) => {
            // Generate signed URLs for all photos
            const signedPhotos = await Promise.all(
              (hostel.photos || []).map((photo) =>
                this.s3ServiceInstance.generateSignedUrl(photo)
              )
            );

            return {
              ...hostel.toObject(), // Convert mongoose document to plain object
              photos: signedPhotos,
            };
          })
        );

        res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: hostelsWithSignedUrls,
        });
      } else {
        res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: [],
        });
      }
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch unverified hostels",
        });
      }
    }
  }

  async getVerifiedHostels(req: AuthRequset, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Admin not authenticated", 401);
      }
      const result = await this.adminServicee.getVerifiedHostels();

      // Generate signed URLs for all hostel photos
      if (result.data && Array.isArray(result.data)) {
        const hostelsWithSignedUrls = await Promise.all(
          result.data.map(async (hostel) => {
            const signedPhotos = await Promise.all(
              (hostel.photos || []).map((photo) =>
                this.s3ServiceInstance.generateSignedUrl(photo)
              )
            );
            return {
              ...hostel.toObject(),
              photos: signedPhotos,
            };
          })
        );

        res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: hostelsWithSignedUrls,
        });
      } else {
        res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: [],
        });
      }
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch verified hostels",
        });
      }
    }
  }

  async getHostelById(req: AuthRequset, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Admin not authenticated", 401);
      }
      const { hostelId } = req.params;
      const result = await this.adminServicee.getHostelById(hostelId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch hostel details",
        });
      }
    }
  }

  async getDashboard(req: AuthRequset, res: Response): Promise<any> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Admin not authenticated", 401);
      }
      const getDashboardData = await this.adminServicee.getAdminDashboard();

      if (getDashboardData) {
        res.status(HttpStatus.OK).json({ success: true, getDashboardData });
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
      console.error("Error in getDashboardData:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export const adminUserControllerr = Container.get(AdminUserController);

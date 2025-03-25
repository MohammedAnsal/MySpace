import { Request, Response } from "express";
import {
  adminService,
  AdminUserService,
} from "../../../services/implements/admin/user.admin.service";
import { IAdminController } from "../../interface/admin/admin.controller.interface";
import Container, { Service } from "typedi";
import { HttpStatus } from "../../../enums/http.status";
import { AuthRequset } from "../../../types/api";
import { IAdminUserService } from "../../../services/interface/admin/user.admin.service.interface";
import { AppError } from "../../../utils/error";
import {
  s3Service,
  S3Service,
} from "../../../services/implements/s3/s3.service";
import { IHostel } from "../../../models/provider/hostel.model";

@Service()
class AdminUserController implements IAdminController {
  private adminServicee: IAdminUserService;
  private s3ServiceInstance = Container.get(s3Service);

  constructor(private userService: AdminUserService) {
    this.adminServicee = adminService;
  }

  async fetchUsers(req: Request, res: Response): Promise<any> {
    const getAllUsers = await this.userService.findAllUser();

    if (getAllUsers) {
      return res.status(200).json(getAllUsers);
    } else {
      throw new Error("failed to  fetch user");
    }
  }

  async fetchProviders(req: Request, res: Response): Promise<any> {
    const getAllProviders = await this.userService.findAllProvider();

    if (getAllProviders) {
      return res.status(200).json(getAllProviders);
    } else {
      throw new Error("failed to fetch providers");
    }
  }

  async updateUser(req: Request, res: Response): Promise<any> {
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
      const { hostelId, isVerified } = req.body;

      const result = await this.adminServicee.verifyHostel(
        hostelId,
        isVerified
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
}

export const AdminUserControllerr = Container.get(AdminUserController);

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
import { IHostelService } from "../../../services/interface/user/hostel.service.interface";
import { hostelService } from "../../../services/implements/user/hostel.service";
import { HostelFilters } from "../../../types/filters";

interface FilteredRequest extends Request {
  query: {
    minPrice?: string;
    maxPrice?: string;
    gender?: string;
    amenities?: string;
    search?: string;
    sortBy?: 'asc' | 'desc';
  };
}

@Service()
class HostelController {
  private hostelServicee: IHostelService;
  private s3ServiceInstance = Container.get(s3Service);

  constructor() {
    this.hostelServicee = hostelService;
  }

  async getVerifiedHostels(req: AuthRequset, res: Response): Promise<void> {
    try {
      const filters = {
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        gender: req.query.gender as string,
        amenities: req.query.amenities ? (req.query.amenities as string).split(',') : undefined,
        search: req.query.search as string,
        sortBy: req.query.sortBy as 'asc' | 'desc',
      };

      const result = await this.hostelServicee.getVerifiedHostels(filters);

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
      const result = await this.hostelServicee.getHostelById(hostelId);

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

export const hostelController = Container.get(HostelController);

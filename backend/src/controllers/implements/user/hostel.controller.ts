import { Request, Response } from "express";
import { IAdminController } from "../../interface/admin/admin.controller.interface";import Container, { Service } from "typedi";
import { HttpStatus } from "../../../enums/http.status";
import { AuthRequset } from "../../../types/api";
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
    sortBy?: "asc" | "desc";
    minRating?: string;
    sortByRating?: string;
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
        amenities: req.query.amenities
          ? (req.query.amenities as string).split(",")
          : undefined,
        search: req.query.search as string,
        sortBy: req.query.sortBy as "asc" | "desc",
        minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
        sortByRating: req.query.sortByRating === 'true',
      };

      const result = await this.hostelServicee.getVerifiedHostels(filters);

      if (result.data && Array.isArray(result.data)) {
        const hostelsWithSignedUrls = await Promise.all(
          result.data.map(async (hostel) => {
            const hostelData = typeof hostel.toObject === 'function' 
              ? hostel.toObject() 
              : { ...hostel };
            
            const signedPhotos = await Promise.all(
              (hostelData.photos || []).map((photo: string) =>
                this.s3ServiceInstance.generateSignedUrl(photo)
              )
            );
            
            return {
              ...hostelData,
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

  async getVerifiedHostelsForHome(req: AuthRequset, res: Response) {
    try {
      const result = await this.hostelServicee.getVerifiedHostelsForHome();

      if (result.data && Array.isArray(result.data)) {
        const hostelsWithSignedUrls = await Promise.all(
          result.data.map(async (hostel) => {
            const hostelData = typeof hostel.toObject === 'function' 
              ? hostel.toObject() 
              : { ...hostel };
            
            const signedPhotos = await Promise.all(
              (hostelData.photos || []).map((photo: string) =>
                this.s3ServiceInstance.generateSignedUrl(photo)
              )
            );
            
            return {
              ...hostelData,
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
          message: "Failed to fetch all verified hostels",
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

  async getNearbyHostels(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { latitude, longitude, radius = 5 } = req.query;
      
      if (!latitude || !longitude) {
        throw new AppError("Latitude and longitude are required", HttpStatus.BAD_REQUEST);
      }
      
      const result = await this.hostelServicee.getNearbyHostels(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        parseFloat(radius as string)
      );

      if (result.data && Array.isArray(result.data)) {
        const hostelsWithSignedUrls = await Promise.all(
          result.data.map(async (hostel) => {
            const hostelData = typeof hostel.toObject === 'function' 
              ? hostel.toObject() 
              : { ...hostel };
            
            const signedPhotos = await Promise.all(
              (hostelData.photos || []).map((photo:string) =>
                this.s3ServiceInstance.generateSignedUrl(photo)
              )
            );
            
            return {
              ...hostelData,
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
          message: "Failed to fetch nearby hostels",
        });
      }
    }
  }
}

export const hostelController = Container.get(HostelController);

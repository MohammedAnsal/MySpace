import Container, { Service } from "typedi";
import { HttpStatus } from "../../../enums/http.status";
import { hostelService } from "../../../services/implements/provider/hostel.service";
import { locationService } from "../../../services/implements/provider/location.service";
import { s3Service } from "../../../services/implements/s3/s3.service";
import { IHostelService } from "../../../services/interface/provider/hostel.service.interface";
import { ILocationService } from "../../../services/interface/provider/location.service.interface";
import { AuthRequset } from "../../../types/api";
import { AppError } from "../../../utils/error";
import { Request, Response } from "express";
@Service()
export class HostelController {
  private hostelServicee: IHostelService;
  private locationServicee: ILocationService;
  private s3ServiceInstance = Container.get(s3Service);

  constructor() {
    this.hostelServicee = hostelService;
    this.locationServicee = locationService;
  }

  async createHostel(req: AuthRequset, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new AppError(
          "At least one image is required",
          HttpStatus.BAD_REQUEST
        );
      }

      if (files.length > 5) {
        throw new AppError("Maximum 5 images allowed", HttpStatus.BAD_REQUEST);
      }

      const locationData = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
      };

      const locationResult = await this.locationServicee.createLocation(
        locationData
      );

      if (!locationResult.success || !locationResult.locationData) {
        throw new AppError("Failed to create location", HttpStatus.BAD_REQUEST);
      }

      const uploadResults = await this.s3ServiceInstance.uploadMultipleFiles(
        files,
        "hostels"
      );
      const imageUrls = uploadResults.map((result) => result.Location);

      const hostelData = {
        ...req.body,
        photos: imageUrls,
        provider_id: req.user,
        location: locationResult.locationData,
        amenities: req.body.amenities ? req.body.amenities : [],
        facilities: req.body.facilities
          ? req.body.facilities.split(",").filter(Boolean)
          : [],
      };

      const createdHostel = await this.hostelServicee.createHostel(hostelData);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Hostel created successfully",
        data: createdHostel,
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
          message: "Failed to create hostel",
        });
      }
    }
  }

  async getAllHostels(req: AuthRequset, res: Response): Promise<void> {
    try {
      const result = await this.hostelServicee.getAllHostels();


      if (result.hostelData && Array.isArray(result.hostelData)) {
        const hostelsWithSignedUrls = await Promise.all(
          result.hostelData.map(async (hostel) => {
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
          message: "Failed to fetch unverified hostels",
        });
      }
    }
  }
}

export const hostelController = Container.get(HostelController);

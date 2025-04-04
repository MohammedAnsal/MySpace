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

  async getHostelById(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { hostelId } = req.params;

      if (!hostelId) {
        throw new AppError("Hostel ID is required", HttpStatus.BAD_REQUEST);
      }

      const result = await this.hostelServicee.getHostelById(hostelId);

      if (result.hostelData) {
        // Generate signed URLs for photos
        const hostelWithSignedUrls = {
          ...(Array.isArray(result.hostelData) 
            ? result.hostelData[0] 
            : result.hostelData
          ),
          photos: await Promise.all(
            ((Array.isArray(result.hostelData) 
              ? result.hostelData[0].photos 
              : result.hostelData.photos) || []
            ).map((photo: string) =>
              this.s3ServiceInstance.generateSignedUrl(photo)
            )
          ),
        };

        res.status(HttpStatus.OK).json({
          success: true,
          message: result.message,
          data: hostelWithSignedUrls,
        });
      } else {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Hostel not found",
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
          message: "Failed to fetch hostel details",
        });
      }
    }
  }

  async editHostel(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { hostelId } = req.params;
      const files = req.files as Express.Multer.File[];
    
     const updateData: any = {};

      const numberFields = ['monthly_rent', 'deposit_amount', 'maximum_occupancy', 'total_space'];
      const stringFields = ['hostel_name', 'description', 'gender', 'rules', 'deposit_terms'];

      stringFields.forEach(field => {
        if (req.body[field]) {
          updateData[field] = req.body[field];
        }
      });

      numberFields.forEach(field => {
        if (req.body[field]) {
          updateData[field] = Number(req.body[field]);
        }
      });

      if (req.body.latitude && req.body.longitude && req.body.address) {
        const locationData = {
          latitude: Number(req.body.latitude),
          longitude: Number(req.body.longitude),
          address: req.body.address
        };

        const locationResult = await this.locationServicee.createLocation(locationData);
        if (locationResult.success && locationResult.locationData) {
          if (Array.isArray(locationResult.locationData)) {
            updateData.location = locationResult.locationData[0]._id;
          } else {
            updateData.location = locationResult.locationData._id;
          }
        }
      }

      if (req.body.amenities) {
        try {
          updateData.amenities = JSON.parse(req.body.amenities);
        } catch (e) {
          console.error('Error parsing amenities:', e);
        }
      }

      if (req.body.facilities) {
        try {
          updateData.facilities = JSON.parse(req.body.facilities);
          console.log(updateData.facilities);
        } catch (e) {
          console.error('Error parsing facilities:', e);
        }
      }

      if (req.body.existingPhotos) {
        try {
          updateData.photos = JSON.parse(req.body.existingPhotos);
        } catch (e) {
          console.error('Error parsing existing photos:', e);
        }
      }

      if (files && files.length > 0) {
        const uploadResults = await this.s3ServiceInstance.uploadMultipleFiles(
          files,
          "hostels"
        );
        const newImageUrls = uploadResults.map((result) => result.Location);
        
        updateData.photos = updateData.photos 
          ? [...updateData.photos, ...newImageUrls]
          : newImageUrls;
      }

      if (Object.keys(updateData).length === 0) {
        throw new AppError("No valid data provided for update", HttpStatus.BAD_REQUEST);
      }

      const result = await this.hostelServicee.editHostelById(hostelId, updateData);

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result.hostelData,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to update hostel",
        });
      }
    }
  }

  async deleteHostel(req: Request, res: Response): Promise<void> {
    try {
      const { hostelId } = req.params;
      const result = await this.hostelServicee.deleteHostelById(hostelId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to delete hostel",
        });
      }
    }
  }
}

export const hostelController = Container.get(HostelController);

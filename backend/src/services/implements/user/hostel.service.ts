import Container, { Service } from "typedi";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";

import { s3Service } from "../../../services/implements/s3/s3.service";
import {
  hostelResult,
  IHostelService,
} from "../../interface/user/hostel.service.interface";
import { IHostelRepository } from "../../../repositories/interfaces/user/hostel.Irepository";
import { hostelRepository } from "../../../repositories/implementations/user/hostel.repository";

@Service()
export class HostelService implements IHostelService {
  private hostelRepositoryy: IHostelRepository;
  private s3ServiceInstance: s3Service;

  constructor(s3Service: s3Service) {
    this.s3ServiceInstance = s3Service;
    this.hostelRepositoryy = hostelRepository;
  }

  async getVerifiedHostels(filters: {
    minPrice?: number;
    maxPrice?: number;
    gender?: string;
    amenities?: string[];
    search?: string;
    sortBy?: "asc" | "desc";
  }): Promise<hostelResult> {
    try {
      const hostels = await this.hostelRepositoryy.getVerifiedHostels(filters);
      return {
        success: true,
        message: "Verified hostels fetched successfully",
        data: hostels,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while fetching verified hostels",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getVerifiedHostelsForHome(): Promise<hostelResult> {
    try {
      const hostels = await this.hostelRepositoryy.getVerifiedHostelsForHome();
      return {
        success: true,
        message: "Verified all hostels fetched successfully",
        data: hostels,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while fetching all verified hostels",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getHostelById(hostelId: string): Promise<hostelResult> {
    try {
      if (!hostelId) {
        throw new AppError("Hostel ID is required", HttpStatus.BAD_REQUEST);
      }

      const hostel = await this.hostelRepositoryy.getHostelById(hostelId);

      if (!hostel) {
        throw new AppError("Hostel not found", HttpStatus.NOT_FOUND);
      }

      if (hostel.photos && hostel.photos.length > 0) {
        const signedPhotos = await Promise.all(
          hostel.photos.map((photo) =>
            this.s3ServiceInstance.generateSignedUrl(photo)
          )
        );
        hostel.photos = signedPhotos;
      }

      return {
        success: true,
        message: "Hostel details fetched successfully",
        data: hostel,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while fetching hostel details",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getNearbyHostels(latitude: number, longitude: number, radius: number): Promise<hostelResult> {
    try {
      if (!latitude || !longitude) {
        throw new AppError("Latitude and longitude are required", HttpStatus.BAD_REQUEST);
      }
      
      const hostels = await this.hostelRepositoryy.getNearbyHostels(latitude, longitude, radius * 1000); // Convert km to meters
      
      return {
        success: true,
        message: "Nearby hostels fetched successfully",
        data: hostels,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while fetching nearby hostels",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const hostelService = Container.get(HostelService);

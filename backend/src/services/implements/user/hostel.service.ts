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
import { HostelResponseDTO, HostelFiltersDTO } from "../../../dtos/user/hostel.dto";

@Service()
export class HostelService implements IHostelService {
  private hostelRepositoryy: IHostelRepository;
  private s3ServiceInstance: s3Service;

  constructor(s3Service: s3Service) {
    this.s3ServiceInstance = s3Service;
    this.hostelRepositoryy = hostelRepository;
  }

  private mapToHostelDTO(hostel: any): HostelResponseDTO {
    return {
      _id: hostel._id.toString(),
      hostel_name: hostel.hostel_name,
      monthly_rent: hostel.monthly_rent,
      deposit_amount: hostel.deposit_amount,
      deposit_terms: hostel.deposit_terms,
      maximum_occupancy: hostel.maximum_occupancy,
      rules: hostel.rules,
      gender: hostel.gender,
      available_space: hostel.available_space,
      total_space: hostel.total_space,
      status: hostel.status,
      photos: hostel.photos,
      amenities: hostel.amenities,
      description: hostel.description,
      location: hostel.location,
      provider_id: hostel.provider_id,
      facilities: hostel.facilities,
      is_verified: hostel.is_verified,
      is_rejected: hostel.is_rejected,
      reason: hostel.reason,
      created_at: hostel.createdAt,
      updated_at: hostel.updatedAt,
      averageRating: hostel.averageRating || 0,
      ratingCount: hostel.ratingCount || 0
    };
  }

  async getVerifiedHostels(filters: HostelFiltersDTO): Promise<hostelResult> {
    try {
      const hostels = await this.hostelRepositoryy.getVerifiedHostels(filters);
      const hostelsDTO = hostels.map(hostel => this.mapToHostelDTO(hostel));
      
      return {
        success: true,
        message: "Verified hostels fetched successfully",
        data: hostelsDTO,
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
      const hostelsDTO = hostels.map(hostel => this.mapToHostelDTO(hostel));
      
      return {
        success: true,
        message: "Verified all hostels fetched successfully",
        data: hostelsDTO,
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

      const hostelDTO = this.mapToHostelDTO(hostel);

      return {
        success: true,
        message: "Hostel details fetched successfully",
        data: hostelDTO,
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
      
      const hostels = await this.hostelRepositoryy.getNearbyHostels(latitude, longitude, radius * 1000);
      const hostelsDTO = hostels.map(hostel => this.mapToHostelDTO(hostel));
      
      return {
        success: true,
        message: "Nearby hostels fetched successfully",
        data: hostelsDTO,
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

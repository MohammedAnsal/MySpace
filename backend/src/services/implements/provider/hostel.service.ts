import Container from "typedi";
import { hostelRepository } from "../../../repositories/implementations/provider/hostel.repository";
import { IHostelRepository } from "../../../repositories/interfaces/provider/hostel.Irepository";
import { IHostel } from "../../../models/provider/hostel.model";
import { Service } from "typedi";
import {
  HostelResult,
  IHostelService,
} from "../../interface/provider/hostel.service.interface";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import {
  HostelResponseDTO,
  CreateHostelDTO,
  UpdateHostelDTO,
} from "../../../dtos/provider/hostel.dto";
import mongoose from "mongoose";

@Service()
class HostelService implements IHostelService {
  private hostelRepositoryy: IHostelRepository;

  constructor() {
    this.hostelRepositoryy = hostelRepository;
  }

  //  For DTO check :-

  private mapToHostelDTO(hostel: IHostel): HostelResponseDTO {
    return {
      _id: (hostel._id as mongoose.Types.ObjectId).toString(),
      hostel_name: hostel.hostel_name || "",
      monthly_rent: hostel.monthly_rent || 0,
      deposit_amount: hostel.deposit_amount || 0,
      deposit_terms: hostel.deposit_terms || [],
      maximum_occupancy: hostel.maximum_occupancy || 0,
      rules: hostel.rules || "",
      gender: hostel.gender || "",
      available_space: hostel.available_space || 0,
      total_space: hostel.total_space || 0,
      status: hostel.status || false,
      photos: hostel.photos || [],
      amenities: hostel.amenities || [],
      description: hostel.description || "",
      location: hostel.location
        ? {
            _id: (hostel.location._id as mongoose.Types.ObjectId).toString(),
            latitude: (hostel.location as any).latitude || 0,
            longitude: (hostel.location as any).longitude || 0,
            address: (hostel.location as any).address || "",
          }
        : {
            _id: "",
            latitude: 0,
            longitude: 0,
            address: "",
          },
      provider_id: hostel.provider_id
        ? {
            _id: (hostel.provider_id as mongoose.Types.ObjectId).toString(),
            fullName: (hostel.provider_id as any).fullName || "",
            email: (hostel.provider_id as any).email || "",
          }
        : {
            _id: "",
            fullName: "",
            email: "",
          },
      facilities: (hostel.facilities || []).map((facility) => ({
        _id: (facility._id as mongoose.Types.ObjectId).toString(),
        name: (facility as any).name || "",
        description: (facility as any).description || "",
        status: (facility as any).status || false,
      })),
      is_verified: hostel.is_verified,
      is_rejected: hostel.is_rejected,
      created_at: hostel.created_at || new Date(),
      updated_at: hostel.updated_at || new Date(),
    };
  }

  //  Create hostel :-

  async createHostel(hostelData: CreateHostelDTO): Promise<HostelResult> {
    try {
      const {
        hostel_name,
        monthly_rent,
        deposit_amount,
        maximum_occupancy,
        gender,
        total_space,
        location,
        provider_id,
        description,
        photos,
      } = hostelData;

      if (
        !hostel_name ||
        !monthly_rent ||
        !deposit_amount ||
        !maximum_occupancy ||
        !gender ||
        !total_space ||
        !location ||
        !provider_id ||
        !description ||
        !photos
      ) {
        throw new AppError("Missing required fields", HttpStatus.BAD_REQUEST);
      }

      const newHostelData: Partial<IHostel> = {
        ...hostelData,
        available_space: total_space,
        status: true,
        is_verified: false,
        provider_id: new mongoose.Types.ObjectId(provider_id),
        location: new mongoose.Types.ObjectId(location._id),
        facilities: hostelData.facilities?.map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
      };

      const createdHostel = await this.hostelRepositoryy.createHostel(
        newHostelData
      );

      return {
        success: true,
        message: "Hostel created successfully",
        hostelData: this.mapToHostelDTO(createdHostel),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to create hostel",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get all hostel's :-

  async getAllHostels(providerId: string): Promise<HostelResult> {
    try {
      const hostels = await this.hostelRepositoryy.getAllHostels(providerId);
      return {
        success: true,
        message: "Hostels fetched successfully",
        hostelData: hostels.map((hostel) => this.mapToHostelDTO(hostel)),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch hostels",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get single hostel :-

  async getHostelById(hostelId: string): Promise<HostelResult> {
    try {
      if (!hostelId) {
        throw new AppError("Hostel ID is required", HttpStatus.BAD_REQUEST);
      }

      const hostel = await this.hostelRepositoryy.findHostelById(hostelId);
      if (!hostel) {
        throw new AppError("Hostel not found", HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: "Hostel fetched successfully",
        hostelData: this.mapToHostelDTO(hostel),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch hostel",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Edit hostel :-

  async editHostelById(
    hostelId: string,
    updateData: UpdateHostelDTO
  ): Promise<HostelResult> {
    try {
      if (!hostelId) {
        throw new AppError("Hostel ID is required", HttpStatus.BAD_REQUEST);
      }

      const existingHostel = await this.hostelRepositoryy.findHostelById(
        hostelId
      );
      if (!existingHostel) {
        throw new AppError("Hostel not found", HttpStatus.NOT_FOUND);
      }

      const updateHostelData: Partial<IHostel> = {
        ...updateData,
        location: updateData.location
          ? new mongoose.Types.ObjectId(updateData.location._id)
          : undefined,
        facilities: updateData.facilities?.map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
      };

      const updatedHostel = await this.hostelRepositoryy.updateHostel(
        hostelId,
        updateHostelData
      );
      if (!updatedHostel) {
        throw new AppError(
          "Failed to update hostel",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return {
        success: true,
        message: "Hostel updated successfully",
        hostelData: this.mapToHostelDTO(updatedHostel),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to update hostel",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Delete hostel :-

  async deleteHostelById(hostelId: string): Promise<HostelResult> {
    try {
      if (!hostelId) {
        throw new AppError("Hostel ID is required", HttpStatus.BAD_REQUEST);
      }

      const existingHostel = await this.hostelRepositoryy.findHostelById(
        hostelId
      );
      if (!existingHostel) {
        throw new AppError("Hostel not found", HttpStatus.NOT_FOUND);
      }

      const isDeleted = await this.hostelRepositoryy.deleteHostel(hostelId);
      if (!isDeleted) {
        throw new AppError(
          "Failed to delete hostel",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return {
        success: true,
        message: "Hostel deleted successfully",
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to delete hostel",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const hostelService = Container.get(HostelService);

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
  CreateHostelDTO,
  UpdateHostelDTO,
} from "../../../dtos/provider/hostel.dto";
import mongoose from "mongoose";
import { mapToHostelDTO } from "../../../dtos/provider/hostel.dto";

@Service()
class HostelService implements IHostelService {
  private hostelRepositoryy: IHostelRepository;

  constructor() {
    this.hostelRepositoryy = hostelRepository;
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
        hostelData: mapToHostelDTO(createdHostel),
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
        hostelData: hostels.map((hostel) => mapToHostelDTO(hostel)),
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
        hostelData: mapToHostelDTO(hostel),
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
        hostelData: mapToHostelDTO(updatedHostel),
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

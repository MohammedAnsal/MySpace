import Container from "typedi";
import { hostelRepository } from "../../../repositories/implementations/provider/hostel.repository";
import { IHostelRepository } from "../../../repositories/interfaces/provider/hostel.Irepository";
import { IHostel } from "../../../models/provider/hostel.model";
import { Service } from "typedi";
import { hostelResult } from "../../interface/provider/hostel.service.interface";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";

@Service()
class HostelService {
  private hostelRepositoryy: IHostelRepository;

  constructor() {
    this.hostelRepositoryy = hostelRepository;
  }

  async createHostel(hostelData: Partial<IHostel>): Promise<hostelResult> {
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

      const newHostelData = {
        ...hostelData,
        available_space: total_space,
        status: true,
        is_verified: false,
      };

      const createdHostel = await this.hostelRepositoryy.createHostel(
        newHostelData
      );

      return {
        success: true,
        message: "Hostel created successfully",
        hostelData: createdHostel,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while creating hostel. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllHostels(): Promise<hostelResult> {
    try {
      const hostels = await this.hostelRepositoryy.getAllHostels();

      return {
        success: true,
        message: "Unverified hostels fetched successfully",
        hostelData: hostels,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while fetching unverified hostels",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const hostelService = Container.get(HostelService);

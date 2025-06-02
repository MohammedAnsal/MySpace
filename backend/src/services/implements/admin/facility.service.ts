import { IAdminFacilityService } from "../../interface/admin/facility.service.interface";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import Container, { Service } from "typedi";
import { IAdminFacilityRepository } from "../../../repositories/interfaces/admin/facility.Irepository";
import { adminFacilityRepository } from "../../../repositories/implementations/admin/facility.repository";
import {
  CreateFacilityDTO,
  UpdateFacilityStatusDTO,
  FacilityResponseDTO,
  FacilityDataDTO,
} from "../../../dtos/admin/facility.dto";

@Service()
export class AdminFacilityService implements IAdminFacilityService {
  private adminFacilityRepository: IAdminFacilityRepository;

  constructor() {
    this.adminFacilityRepository = adminFacilityRepository;
  }

  async createFacility(data: CreateFacilityDTO): Promise<FacilityResponseDTO> {
    try {
      const { name, price, description } = data;

      if (!name || !price || !description) {
        return {
          success: false,
          message: "Name, price, and description are required",
        };
      }

      const facilityData: FacilityDataDTO = {
        name,
        price,
        description,
        status: true,
      };

      const newFacility = await this.adminFacilityRepository.createFacility(
        facilityData
      );

      return {
        success: true,
        message: "Facility added successfully.",
        facilityData: newFacility,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while creating facility",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllFacilities(): Promise<FacilityResponseDTO> {
    try {
      const facilities = await this.adminFacilityRepository.findAllFacilities();
      return {
        success: true,
        message: "Facilities fetched successfully",
        facilityData: facilities,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while fetching facilities",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findFacilityById(facilityId: string): Promise<FacilityResponseDTO> {
    try {
      const facility = await this.adminFacilityRepository.findFacilityById(
        facilityId
      );

      if (!facility) {
        return {
          success: false,
          message: "Facility not found",
        };
      }

      return {
        success: true,
        message: "Facility fetched successfully",
        facilityData: facility,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while fetching facility",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateFacilityStatus(
    data: UpdateFacilityStatusDTO
  ): Promise<FacilityResponseDTO> {
    try {
      const { facilityId, status } = data;
      const updatedFacility =
        await this.adminFacilityRepository.updateFacilityStatus(
          facilityId,
          status
        );

      if (!updatedFacility) {
        return {
          success: false,
          message: "Facility not found",
        };
      }

      return {
        success: true,
        message: "Facility status updated successfully",
        facilityData: updatedFacility,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while updating facility status",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteFacility(facilityId: string): Promise<FacilityResponseDTO> {
    try {
      const deletedFacility = await this.adminFacilityRepository.deleteFacility(
        facilityId
      );

      if (!deletedFacility) {
        return {
          success: false,
          message: "Facility not found",
        };
      }

      return {
        success: true,
        message: "Facility deleted successfully",
        facilityData: deletedFacility,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while deleting facility",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const adminFacilityService = Container.get(AdminFacilityService);

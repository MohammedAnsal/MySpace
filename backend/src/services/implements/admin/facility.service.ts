import {
  AdminFacilityResult,
  IAdminFacilityService,
} from "../../interface/admin/facility.service.interface";
import { IAdminFacility } from "../../../models/admin/facility.model";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import Container, { Service } from "typedi";
import { IAdminFacilityRepository } from "../../../repositories/interfaces/admin/facility.Irepository";
import { adminFacilityRepository } from "../../../repositories/implementations/admin/facility.repository";

@Service()
export class AdminFacilityService implements IAdminFacilityService {
  private adminFacilityRepository: IAdminFacilityRepository;

  constructor() {
    this.adminFacilityRepository = adminFacilityRepository;
  }

  async createFacility(
    facilityData: Partial<IAdminFacility>
  ): Promise<AdminFacilityResult> {
    try {
      const { name, price, description } = facilityData;

      if (!name || !price || !description) {
        return { success: false, message: "Name, price, and description are required" };
      }

      const newFacility = await this.adminFacilityRepository.createFacility(facilityData);

      return { 
        success: true, 
        message: "Facility added successfully.",
        facilityData: newFacility
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while creating facility. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllFacilities(): Promise<AdminFacilityResult> {
    try {
      const facilities = await this.adminFacilityRepository.findAllFacilities();
      
      return { 
        success: true, 
        message: "Facilities fetched successfully",
        facilityData: facilities 
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while fetching facilities. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findFacilityById(facilityId: string): Promise<AdminFacilityResult> {
    try {
      const facility = await this.adminFacilityRepository.findFacilityById(facilityId);
      
      if (!facility) {
        return { 
          success: false, 
          message: "Facility not found" 
        };
      }
      
      return { 
        success: true, 
        message: "Facility fetched successfully",
        facilityData: facility 
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while fetching facility. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateFacilityStatus(facilityId: string, status: boolean): Promise<AdminFacilityResult> {
    try {
      const updatedFacility = await this.adminFacilityRepository.updateFacilityStatus(facilityId, status);
      
      if (!updatedFacility) {
        return {
          success: false,
          message: "Facility not found"
        };
      }
      
      return {
        success: true,
        message: "Facility status updated successfully",
        facilityData: updatedFacility
      };
    } catch (error) {
      throw new AppError(
        "An error occurred while updating facility status.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteFacility(facilityId: string): Promise<AdminFacilityResult> {
    try {
      const deletedFacility = await this.adminFacilityRepository.deleteFacility(facilityId);
      
      if (!deletedFacility) {
        return {
          success: false,
          message: "Facility not found"
        };
      }
      
      return {
        success: true,
        message: "Facility deleted successfully",
        facilityData: deletedFacility
      };
    } catch (error) {
      throw new AppError(
        "An error occurred while deleting facility.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const adminFacilityService = Container.get(AdminFacilityService); 
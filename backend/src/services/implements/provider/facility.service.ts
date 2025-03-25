import {
  facilityResult,
  IFacilityService,
} from "../../interface/provider/facility.service.interface";
import { IFacility } from "../../../models/provider/facility.model";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import Container, { Service } from "typedi";
import { IFacilityRepository } from "../../../repositories/interfaces/provider/facility.Irepository";
import { facilityRepository } from "../../../repositories/implementations/provider/facility.repository";
@Service()
export class FacilityService {
  private facilityRepositoryy: IFacilityRepository;

  constructor(facilityRepositoryy: IFacilityRepository) {
    this.facilityRepositoryy = facilityRepository;
  }

  async createFacility(
    facilityData: Partial<IFacility>
  ): Promise<facilityResult> {
    try {
      const { name, price, description } = facilityData;

      if (!name || !price || !description) {
        return { success: false, message: "Need all data" };

      }

      await this.facilityRepositoryy.createFacility(facilityData);

      return { success: true, message: "Facility added success." };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while creating facility in. Please try again .",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllFacilities(providerId: string): Promise<facilityResult> {
    try {
      const facilities = await this.facilityRepositoryy.findAllFacilities(providerId);
      
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

  //   async getFacilityById(facilityId: string): Promise<IFacility | null> {
  //     return await this.facilityRepository.getFacilityById(facilityId);
  //   }

  //   async getFacilitiesByHostel(hostelId: string): Promise<IFacility[]> {
  //     return await this.facilityRepository.getFacilitiesByHostel(hostelId);
  //   }

  //   async getFacilitiesByProvider(providerId: string): Promise<IFacility[]> {
  //     return await this.facilityRepository.getFacilitiesByProvider(providerId);
  //   }

  async updateFacilityStatus(facilityId: string, status: boolean): Promise<facilityResult> {
    try {
      const updatedFacility = await this.facilityRepositoryy.updateFacilityStatus(facilityId, status);
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

  async deleteFacility(facilityId: string): Promise<facilityResult> {
    try {
      await this.facilityRepositoryy.deleteFacility(facilityId);
      return {
        success: true,
        message: "Facility deleted successfully"
      };
    } catch (error) {
      throw new AppError(
        "An error occurred while deleting facility.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const facilityService = Container.get(FacilityService);

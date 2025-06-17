import Container, { Service } from "typedi";
import {
  AdminFacility,
  IAdminFacility,
} from "../../../models/admin/facility.model";
import { IAdminFacilityRepository } from "../../interfaces/admin/facility.Irepository";

@Service()
export class AdminFacilityRepository implements IAdminFacilityRepository {
  //  For create facility :-

  async createFacility(
    facilityData: Partial<IAdminFacility>
  ): Promise<IAdminFacility> {
    try {
      return await AdminFacility.create(facilityData);
    } catch (error) {
      throw new Error(`Error creating facility: ${error}`);
    }
  }

  //  For find all facility's :-

  async findAllFacilities(): Promise<IAdminFacility[]> {
    try {
      return await AdminFacility.find();
    } catch (error) {
      throw new Error(`Error finding all facilities: ${error}`);
    }
  }

  //  For find single facility :-

  async findFacilityById(facilityId: string): Promise<IAdminFacility | null> {
    try {
      return await AdminFacility.findById(facilityId);
    } catch (error) {
      console.error("Error finding facility:", error);
      throw new Error("Failed to find facility");
    }
  }

  //  For update facility status :-

  async updateFacilityStatus(
    facilityId: string,
    status: boolean
  ): Promise<IAdminFacility | null> {
    try {
      return await AdminFacility.findByIdAndUpdate(
        facilityId,
        { status: status },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating facility status: ${error}`);
    }
  }

  //  For delete facility :-

  async deleteFacility(facilityId: string): Promise<IAdminFacility | null> {
    try {
      return await AdminFacility.findByIdAndDelete(facilityId);
    } catch (error) {
      throw new Error(`Error deleting facility: ${error}`);
    }
  }
}

export const adminFacilityRepository = Container.get(AdminFacilityRepository);

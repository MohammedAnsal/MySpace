import Container, { Service } from "typedi";
import { Facility, IFacility } from "../../../models/provider/facility.model";
import { IFacilityRepository } from "../../interfaces/provider/facility.Irepository";
@Service()
export class FacilityRepository implements IFacilityRepository {
  async createFacility(facilityData: Partial<IFacility>): Promise<IFacility> {
    try {
      return await Facility.create(facilityData);
    } catch (error) {
      throw new Error(`Error creating facility: ${error}`);
    }
  }

  // async findFacilityById(facilityId: string): Promise<IFacility | null> {
  //   try {
  //     return await Facility.findById(facilityId);
  //   } catch (error) {
  //     throw new Error(`Error finding facility by ID: ${error}`);
  //   }
  // }

  // async findFacilitiesByHostel(hostelId: string): Promise<IFacility[]> {
  //   try {
  //     return await Facility.find({ hostel_id: hostelId });
  //   } catch (error) {
  //     throw new Error(`Error finding facilities by hostel: ${error}`);
  //   }
  // }

  // async findFacilitiesByProvider(providerId: string): Promise<IFacility[]> {
  //   try {
  //     return await Facility.find({ provider_id: providerId });
  //   } catch (error) {
  //     throw new Error(`Error finding facilities by provider: ${error}`);
  //   }
  // }

  async updateFacilityStatus(
    facilityId: string,
    status: boolean
  ): Promise<IFacility | null> {
    try {
      return await Facility.findByIdAndUpdate(
        facilityId,
        { status: status },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating facility status: ${error}`);
    }
  }

  async deleteFacility(facilityId: string): Promise<IFacility | null> {
    try {
      return await Facility.findByIdAndDelete(facilityId);
    } catch (error) {
      throw new Error(`Error deleting facility: ${error}`);
    }
  }

  async findAllFacilities(providerId: string): Promise<IFacility[]> {
    try {
      return await Facility.find({ provider_id: providerId });
    } catch (error) {
      throw new Error(`Error finding all facilities: ${error}`);
    }
  }
}

export const facilityRepository = Container.get(FacilityRepository);

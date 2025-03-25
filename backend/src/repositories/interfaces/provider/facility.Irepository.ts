import { IFacility } from "../../../models/provider/facility.model";

export interface IFacilityRepository {
  createFacility(facilityData: Partial<IFacility>): Promise<IFacility>;
  // findFacilityById(facilityId: string): Promise<IFacility | null>;
  // findFacilitiesByHostel(hostelId: string): Promise<IFacility[]>;
  // findFacilitiesByProvider(providerId: string): Promise<IFacility[]>;
  findAllFacilities(providerId: string): Promise<IFacility[]>;
  updateFacilityStatus(
    providerId: string,
    status: boolean
  ): Promise<IFacility | null>;
  deleteFacility(facilityId: string): Promise<IFacility | null>;
}

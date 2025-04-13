import { IAdminFacility } from "../../../models/admin/facility.model";

export interface IAdminFacilityRepository {
  createFacility(
    facilityData: Partial<IAdminFacility>
  ): Promise<IAdminFacility>;
  findAllFacilities(): Promise<IAdminFacility[]>;
  findFacilityById(facilityId: string): Promise<IAdminFacility | null>;
  updateFacilityStatus(
    facilityId: string,
    status: boolean
  ): Promise<IAdminFacility | null>;
  deleteFacility(facilityId: string): Promise<IAdminFacility | null>;
  // findFacilityById(facilityId: string): Promise<IFacility | null>;
  // findFacilitiesByHostel(hostelId: string): Promise<IFacility[]>;
  // findFacilitiesByProvider(providerId: string): Promise<IFacility[]>;
}

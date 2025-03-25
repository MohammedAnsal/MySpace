import { IFacility } from "../../../models/provider/facility.model";

export type facilityResult = {
  facilityData?: IFacility | IFacility[] | null;
  success: boolean;
  message: string;
};

export interface IFacilityService {
  createFacility(facilityData: Partial<IFacility>): Promise<facilityResult>;
  findAllFacilities(providerId: string): Promise<facilityResult>;
  updateFacilityStatus(
    facilityId: string,
    status: boolean
  ): Promise<facilityResult>;
  deleteFacility(facilityId: string): Promise<facilityResult>;
  // getFacilityById(facilityId: string): Promise<IFacility | null>;
  // getFacilitiesByHostel(hostelId: string): Promise<IFacility[]>;
  // getFacilitiesByProvider(providerId: string): Promise<IFacility[]>;
}

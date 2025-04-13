import { IAdminFacility } from "../../../models/admin/facility.model";

export type AdminFacilityResult = {
  facilityData?: IAdminFacility | IAdminFacility[] | null;
  success: boolean;
  message: string;
};

export interface IAdminFacilityService {
  createFacility(facilityData: Partial<IAdminFacility>): Promise<AdminFacilityResult>;
  findAllFacilities(): Promise<AdminFacilityResult>;
  updateFacilityStatus(
    facilityId: string,
    status: boolean
  ): Promise<AdminFacilityResult>;
  deleteFacility(facilityId: string): Promise<AdminFacilityResult>;
  findFacilityById(facilityId: string): Promise<AdminFacilityResult>;
} 
import { IAdminFacility } from "../../models/admin/facility.model";

// Request DTOs
export interface CreateFacilityDTO {
  name: string;
  price: number;
  description: string;
  status?: boolean;
}

export interface UpdateFacilityStatusDTO {
  facilityId: string;
  status: boolean;
}

export interface UpdateFacilityDTO {
  name: string;
  price: number;
  description: string;
}

// Response DTOs
export interface FacilityResponseDTO {
  success: boolean;
  message: string;
  facilityData?: IAdminFacility | IAdminFacility[] | null;
}

// Internal DTOs
export interface FacilityDataDTO extends Partial<IAdminFacility> {
  name: string;
  price: number;
  description: string;
  status?: boolean;
}

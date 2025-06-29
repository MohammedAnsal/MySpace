import { 
  CreateFacilityDTO,
  UpdateFacilityStatusDTO,
  UpdateFacilityDTO,
  FacilityResponseDTO
} from "../../../dtos/admin/facility.dto";

export interface IAdminFacilityService {
  createFacility(data: CreateFacilityDTO): Promise<FacilityResponseDTO>;
  findAllFacilities(): Promise<FacilityResponseDTO>;
  updateFacilityStatus(data: UpdateFacilityStatusDTO): Promise<FacilityResponseDTO>;
  updateFacility(facilityId: string, data: UpdateFacilityDTO): Promise<FacilityResponseDTO>;
  deleteFacility(facilityId: string): Promise<FacilityResponseDTO>;
  findFacilityById(facilityId: string): Promise<FacilityResponseDTO>;
} 
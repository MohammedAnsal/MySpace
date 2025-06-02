import {
  ProviderResponseDTO,
  UpdateProviderDTO,
  DashboardResponseDTO,
} from "../../../dtos/provider/provider.dto";
import { AdminFacilityResult } from "../admin/facility.service.interface";

export interface IProviderService {
  findProvider(userId: string): Promise<{
    success: boolean;
    message?: string;
    data?: ProviderResponseDTO;
  }>;
  changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }>;
  editProfile(
    data: UpdateProviderDTO,
    userId: string,
    image?: Express.Multer.File
  ): Promise<{ success: boolean; message: string }>;
  getProviderDashboard(providerId: string): Promise<DashboardResponseDTO>;
  findAllFacilities(): Promise<AdminFacilityResult>;
}

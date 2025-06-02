import { IHostel } from "../../../models/provider/hostel.model";
import { 
  AdminSearchDTO,
  AdminVerifyHostelDTO,
  AdminUserResponseDTO,
  AdminUserUpdateResponseDTO,
  AdminHostelResponseDTO,
  AdminDashboardResponseDTO,
  AdminWalletDTO
} from "../../../dtos/admin/user.dto";

export type AdminResult = {
  success: boolean;
  message: string;
  data?: IHostel | IHostel[] | null;
};

export interface IAdminUserService {
  createWallet(adminId: string): Promise<AdminWalletDTO>;
  findAllUser(data: AdminSearchDTO): Promise<AdminUserResponseDTO>;
  findAllProvider(data: AdminSearchDTO): Promise<AdminUserResponseDTO>;
  updateUser(email: string): Promise<AdminUserUpdateResponseDTO>;
  verifyHostel(data: AdminVerifyHostelDTO): Promise<AdminHostelResponseDTO>;
  getHostelById(hostelId: string): Promise<AdminHostelResponseDTO>;
  getUnverifiedHostels(): Promise<AdminHostelResponseDTO>;
  getVerifiedHostels(): Promise<AdminHostelResponseDTO>;
  getAdminDashboard(): Promise<AdminDashboardResponseDTO>;
}

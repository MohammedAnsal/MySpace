import { IUser } from "../../../models/user.model";
import { IHostel } from "../../../models/provider/hostel.model";

export type AdminResult = {
  success: boolean;
  message: string;
  data?: IHostel | IHostel[] | null;
};

export interface IAdminUserService {
  createWallet(adminId: string): Promise<any>;
  findAllUser(searchQuery?: string): Promise<{ success: boolean; data: IUser[] }>;
  findAllProvider(searchQuery?: string): Promise<{ success: boolean; data: IUser[] }>;
  updateUser(email: string): Promise<{ success: boolean; message: string }>;
  verifyHostel(
    hostelId: string,
    reason: string,
    isVerified: boolean,
    isRejected: boolean
  ): Promise<AdminResult>;
  getHostelById(hostelId: string): Promise<AdminResult>;
  getUnverifiedHostels(): Promise<AdminResult>;
  getVerifiedHostels(): Promise<AdminResult>;
  getAdminDashboard(): Promise<any>;
}

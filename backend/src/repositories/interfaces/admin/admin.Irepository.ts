import { IAdmin } from "../../../models/admin/admin.model";
import { IRepository } from "../base.Irepository";
import { IHostel } from "../../../models/provider/hostel.model";

export interface IAdminRepository extends IRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;
  updatePassword(email: string, newPassword: string): Promise<IAdmin | null>;
  verifyHostel(
    hostelId: string,
    reason: string,
    isRejected: boolean,
    isVerified: boolean
  ): Promise<IHostel | null>;
  getHostelById(hostelId: string): Promise<IHostel | null>;
  getUnverifiedHostels(): Promise<IHostel[]>;
  getVerifiedHostels(): Promise<IHostel[]>;
}

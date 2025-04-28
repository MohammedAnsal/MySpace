import { IAdminFacility } from "../../../models/admin/facility.model";
import { IUser } from "../../../models/user.model";
import { IRepository } from "../base.Irepository";

export interface IProviderRepository extends IRepository<IUser> {
  findProviderByEmail(email: string): Promise<IUser | null | never>;
  findProviderByRole(role: string): Promise<IUser[] | never>;
  verifyProvider(
    email: string,
    is_verified: boolean
  ): Promise<IUser | null | never>;
    findAllFacilities(): Promise<IAdminFacility[]>;
  
}

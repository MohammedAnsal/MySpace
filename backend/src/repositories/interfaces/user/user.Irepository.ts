import { IUser } from "../../../models/user.model";
import { IRepository } from "../base.Irepository";

export interface IUserRepository extends IRepository<IUser> {
  findUserByEmail(email: string): Promise<IUser | null | never>;
  // findUserByRole(role: string, searchQuery?: string): Promise<IUser[] | never>;
  findUserByRole(
    role: string,
    page: number,
    limit: number,
    searchQuery?: string
  ): Promise<{ users: IUser[]; total: number }>;
  verifyUser(
    email: string,
    is_verified: boolean
  ): Promise<IUser | null | never>;
  updatePassword(email: string, newPassword: string): Promise<IUser | null>;
}

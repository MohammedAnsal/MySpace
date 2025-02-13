import { IUser } from "../../../models/user.model";
import { IRepository } from "../base.Irepository";

export interface IUserRepository extends IRepository<IUser> {
  findUserByEmail(email: string): Promise<IUser | null | never>;
  findUserByRole(role: string): Promise<IUser[] | never>;
  verifyUser(
    email: string,
    is_verified: boolean
  ): Promise<IUser | null | never>;
}

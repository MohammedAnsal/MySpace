import { IUser } from "../../../models/user.model";

export interface IAdminUserService {
  findAllUser(): Promise<{ success: boolean; data: IUser[] }>;
  findAllProvider(): Promise<{ success: boolean; data: IUser[] }>;
  updateUser(email: string): Promise<{ success: boolean; message: string }>;
}

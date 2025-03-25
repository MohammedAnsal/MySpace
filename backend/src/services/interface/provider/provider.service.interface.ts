import { IUser } from "../../../models/user.model";

export interface IProviderService {
  findProvider(
    userId: string
  ): Promise<{ success: boolean; message?: string; data?: IUser[] }>;
  changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }>;
  editProfile(
    data: IUser,
    userId: string
  ): Promise<{ success: boolean; message: string }>;
}

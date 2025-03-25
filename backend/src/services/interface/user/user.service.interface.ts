import { IUser } from "../../../models/user.model";

export interface IUserService {
  findUser(
    userId: string
  ): Promise<{ success: boolean; message?: string; data?: IUser[] }>;
  changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }>;
  editProfile(
    data: IUser,
    userId: string,
    image?: Express.Multer.File
  ): Promise<{ success: boolean; message: string }>;
}

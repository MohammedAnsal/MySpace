import { IUser } from "../../../models/user.model";

export interface IUserService {
  findUser(
    userId: string
  ): Promise<{ success: boolean; message?: string; data?: IUser[] }>;
 
}

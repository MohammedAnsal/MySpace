import { Service } from "typedi";
import { IUser } from "../../../models/user.model";
import { UserRepository } from "../../../repositories/implementations/user/user.repository";
import { IAdminUserService } from "../../interface/admin/user.admin.service.interface";

@Service()
export class AdminUserService implements IAdminUserService {
  constructor(private userRepo: UserRepository) {}

  async findAllUser(): Promise<{ success: boolean; data: IUser[] }> {
    try {
      const allUsers = await this.userRepo.findUserByRole("user");

      if (allUsers) {
        return { success: true, data: allUsers };
      } else {
        throw new Error("faild to fetch user");
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async findAllProvider(): Promise<{ success: boolean; data: IUser[] }> {
    try {
      const allProviders = await this.userRepo.findUserByRole("provider");

      if (allProviders) {
        return { success: true, data: allProviders };
      } else {
        throw new Error("faild to fetch providers");
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateUser(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      return { success: false, message: "k" };
    } catch (error) {
      throw new Error("internal error");
    }
  }
}

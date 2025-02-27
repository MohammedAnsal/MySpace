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
        throw new Error("faild to fetch provider");
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateUser(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const findUser = await this.userRepo.findUserByEmail(email);

      if (findUser) {
        findUser.is_active = !findUser.is_active;
        await findUser.save();

        console.log(findUser, "afterrrr");

        return { success: true, message: "User status updated" };
      } else {
        return { success: false, message: "User status didn't updated" };
      }
    } catch (error) {
      throw new Error("internal error");
    }
  }
}

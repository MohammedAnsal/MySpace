import { Service } from "typedi";
import { IUser } from "../../../models/user.model";
import { UserRepository } from "../../../repositories/implementations/user/user.repository";
import { IUserService } from "../../interface/user/user.service.interface";

@Service()
export class UserService implements IUserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async findUser(
    userId: string
  ): Promise<{ success: boolean; message?: string; data?: IUser[] }> {
    try {
      const currentUser = await this.userRepo.findById(userId);

      if (currentUser) {
        const { password, ...rest } = currentUser.toObject();
        return { success: true, data: rest };
      } else throw new Error("failed to fetch");
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

}

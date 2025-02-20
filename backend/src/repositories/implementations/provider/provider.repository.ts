import { Service } from "typedi";
import { IUser, User } from "../../../models/user.model";
import { BaseRepository } from "../../base.repository";
import { IProviderRepository } from "../../interfaces/provider/provider.Irepository";

@Service()
export class ProviderRepository
  extends BaseRepository<IUser>
  implements IProviderRepository
{
  constructor() {
    super(User);
  }

  async findProviderByEmail(email: string): Promise<IUser | null | never> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      return Promise.reject(
        new Error(`Error finding provider by email: ${error}`)
      );
    }
  }

  async findProviderByRole(role: string): Promise<IUser[] | never> {
    try {
      return await User.find({ role }, "-password");
    } catch (error) {
      return Promise.reject(
        new Error(`Error finding provider's by role: ${error}`)
      );
    }
  }

  async verifyProvider(
    email: string,
    is_verified: boolean
  ): Promise<IUser | null | never> {
    try {
      await User.updateOne({ email }, { is_verified });
      return await User.findOne({ email });
    } catch (error) {
      return Promise.reject(
        new Error(`Error finding provider by email: ${error}`)
      );
    }
  }
}

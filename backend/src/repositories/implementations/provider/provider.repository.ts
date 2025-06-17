import { Service } from "typedi";
import { IUser, User } from "../../../models/user.model";
import { BaseRepository } from "../../base.repository";
import { IProviderRepository } from "../../interfaces/provider/provider.Irepository";
import {
  AdminFacility,
  IAdminFacility,
} from "../../../models/admin/facility.model";

@Service()
export class ProviderRepository
  extends BaseRepository<IUser>
  implements IProviderRepository
{
  constructor() {
    super(User);
  }

  //  For find by email :-

  async findProviderByEmail(email: string): Promise<IUser | null | never> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      return Promise.reject(
        new Error(`Error finding provider by email: ${error}`)
      );
    }
  }

  //  For find by role :-

  async findProviderByRole(role: string): Promise<IUser[] | never> {
    try {
      return await User.find({ role }, "-password");
    } catch (error) {
      return Promise.reject(
        new Error(`Error finding provider's by role: ${error}`)
      );
    }
  }

  //  For verifiy provider :- (provider)

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

  //  For update password :- (provider)

  async updatePassword(
    email: string,
    newPassword: string
  ): Promise<IUser | null> {
    try {
      const updatePassword = await User.findOneAndUpdate(
        { email },
        { $set: { password: newPassword } },
        { new: true }
      );

      return updatePassword;
    } catch (error) {
      return Promise.reject(
        new Error(`Error updating user password: ${error}`)
      );
    }
  }

  //  For find all facility's :-

  async findAllFacilities(): Promise<IAdminFacility[]> {
    try {
      return await AdminFacility.find();
    } catch (error) {
      throw new Error(`Error finding all facilities: ${error}`);
    }
  }
}

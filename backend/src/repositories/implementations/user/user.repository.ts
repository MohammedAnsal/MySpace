import { Service } from "typedi";
import { IUser, User } from "../../../models/user.model";
import { BaseRepository } from "../../base.repository";
import { IUserRepository } from "../../interfaces/user/user.Irepository";

@Service()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async findUserByEmail(email: string): Promise<IUser | null | never> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      return Promise.reject(new Error(`Error finding user by email: ${error}`));
    }
  }

  async findUserByRole(role: string): Promise<IUser[] | never> {
    try {
      return await User.find({ role }, "-password");
    } catch (error) {
      return Promise.reject(new Error(`Error finding users by role: ${error}`));
    }
  }

  async verifyUser(
    email: string,
    is_verified: boolean
  ): Promise<IUser | null | never> {
    try {
      await User.updateOne({ email }, { is_verified });
      return await User.findOne({ email });
    } catch (error) {
      return Promise.reject(
        new Error(`Error finding users by email: ${error}`)
      );
    }
  }

  async updatePassword(
    email: string,
    newPassword: string
  ): Promise<IUser | null> {
    try {
      console.log(email);
      console.log(newPassword);

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
}

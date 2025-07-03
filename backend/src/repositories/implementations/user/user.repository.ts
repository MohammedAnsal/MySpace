import Container, { Service } from "typedi";
import { IUser, User } from "../../../models/user.model";
import { BaseRepository } from "../../base.repository";
import { IUserRepository } from "../../interfaces/user/user.Irepository";
import { FilterQuery } from "mongoose";

@Service()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  //  For find by email :- (user)

  async findUserByEmail(email: string): Promise<IUser | null | never> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      return Promise.reject(new Error(`Error finding user by email: ${error}`));
    }
  }

  //  For find by role :- (user)

  async findUserByRole(
    role: string,
    page: number = 1,
    limit: number = 5,
    searchQuery?: string
  ): Promise<{ users: IUser[]; total: number }> {
    try {
      let query: FilterQuery<IUser> = { role };

      if (searchQuery) {
        query = {
          ...query,
          $or: [
            { fullName: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
          ],
        };
      }

      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        User.find(query, "-password").skip(skip).limit(limit),
        User.countDocuments(query),
      ]);
      return { users, total };
    } catch (error) {
      return Promise.reject(new Error(`Error finding users by role: ${error}`));
    }
  }

  //  For verify user :-

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

  //  For update password :-

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
}

export const userRepository = Container.get(UserRepository);

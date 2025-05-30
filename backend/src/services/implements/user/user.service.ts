import { Service } from "typedi";
import { IUser } from "../../../models/user.model";
import { UserRepository } from "../../../repositories/implementations/user/user.repository";
import { IUserService } from "../../interface/user/user.service.interface";
import { comparePassword, hashPassword } from "../../../utils/password.utils";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { S3Service, s3Service } from "../s3/s3.service";
import Container from "typedi";
import { IWalletService } from "../../interface/wallet/wallet.service.interface";
import { walletService } from "../wallet/wallet.service";
import IS3service from "../../interface/s3/s3.service.interface";

@Service()
export class UserService implements IUserService {
  private userRepo: UserRepository;
  private s3Service: IS3service;
  private walletService: IWalletService;

  constructor() {
    this.userRepo = new UserRepository();
    this.s3Service = S3Service;
    this.walletService = walletService;
  }

  async findUser(userId: string): Promise<{
    success: boolean;
    message?: string;
    data?: IUser & { wallet: number };
  }> {
    try {
      const currentUser = await this.userRepo.findById(userId);

      if (currentUser) {
        currentUser.profile_picture = await this.s3Service.generateSignedUrl(
          currentUser.profile_picture
        );

        const walletData = await this.walletService.getUserWallet(userId);
        const { password, ...rest } = currentUser.toObject();

        // Include wallet inside data
        const userDataWithWallet = {
          ...rest,
          wallet: walletData.balance,
        };

        return { success: true, data: userDataWithWallet };
      } else {
        throw new Error("failed to fetch");
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while finding the user. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!email) {
        return { success: false, message: "Email is required." };
      }

      if (!oldPassword) {
        return { success: false, message: "Old password is required." };
      }

      if (!newPassword) {
        return { success: false, message: "New password is required." };
      }

      const user = await this.userRepo.findUserByEmail(email);

      if (!user) {
        return { success: false, message: "User does not exist." };
      }

      const isPasswordMatch = await comparePassword(oldPassword, user.password);

      if (!isPasswordMatch) {
        return { success: false, message: "Old password is incorrect." };
      }

      const hashedPassword = await hashPassword(newPassword);
      await this.userRepo.updatePassword(email, hashedPassword);

      return { success: true, message: "Password changed successfully." };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "An error occurred while changing the password. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async editProfile(
    data: IUser,
    userId: string,
    image?: Express.Multer.File
  ): Promise<{ success: boolean; message: string; data: IUser }> {
    try {
      if (!data || !userId) {
        throw new AppError(
          !data ? "Data is required." : "UserId is required.",
          HttpStatus.BAD_REQUEST
        );
      }

      const user = await this.userRepo.findById(userId);
      if (!user) {
        throw new AppError("User does not exist.", HttpStatus.NOT_FOUND);
      }
      if (image) {
        try {
          const uploadResult = await this.s3Service.uploadFile(
            image,
            "user-profile"
          );

          if (Array.isArray(uploadResult)) {
            if (uploadResult[0]?.success) {
              data.profile_picture = uploadResult[0].Location;
            }
          } else {
            if (uploadResult?.success) {
              data.profile_picture = uploadResult.Location;
            }
          }

          if (user.profile_picture) {
            try {
              await this.s3Service.delete_File([user.profile_picture]);
              console.log("Previous profile image deleted successfully");
            } catch (deleteError) {
              console.error(
                "Error deleting previous profile image:",
                deleteError
              );
            }
          }
        } catch (uploadError) {
          console.error("Error uploading image to S3:", uploadError);
          throw new AppError(
            "Failed to upload profile image. Please try again.",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }

      const userProfile = await this.userRepo.update(userId, data);
      if (!userProfile) {
        throw new AppError("User not found", HttpStatus.NOT_FOUND);
      }
      userProfile.profile_picture = await this.s3Service.generateSignedUrl(
        userProfile.profile_picture
      );
      const { password, ...rest } = userProfile.toObject();
      return {
        success: true,
        message: "Profile updated successfully.",
        data: rest as IUser,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An unexpected error occurred while updating the profile. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

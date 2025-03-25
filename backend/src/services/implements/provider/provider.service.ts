import { Service } from "typedi";
import { HttpStatus } from "../../../enums/http.status";
import { IUser } from "../../../models/user.model";
import { ProviderRepository } from "../../../repositories/implementations/provider/provider.repository";
import { AppError } from "../../../utils/error";
import { IProviderService } from "../../interface/provider/provider.service.interface";
import { comparePassword, hashPassword } from "../../../utils/password.utils";
import { s3Service } from "../s3/s3.service";

@Service()
export class ProviderService implements IProviderService {
  private providerRepo: ProviderRepository;
  private s3Service: s3Service;

  constructor() {
    this.providerRepo = new ProviderRepository();
    this.s3Service = new s3Service();
  }

  async findProvider(
    userId: string
  ): Promise<{ success: boolean; message?: string; data?: IUser[] }> {
    try {
      const currentProvider = await this.providerRepo.findById(userId);

      if (currentProvider) {
        currentProvider.profile_picture =
          await this.s3Service.generateSignedUrl(
            currentProvider.profile_picture
          );

        const { password, ...rest } = currentProvider.toObject();
        return { success: true, data: rest };
      } else throw new Error("failed to fetch");
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while findUser in. Please try again .",
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

      const user = await this.providerRepo.findProviderByEmail(email);

      if (!user) {
        return { success: false, message: "User does not exist." };
      }

      const isPasswordMatch = await comparePassword(oldPassword, user.password);

      if (!isPasswordMatch) {
        return { success: false, message: "Old password is incorrect." };
      }

      const hashedPassword = await hashPassword(newPassword);
      await this.providerRepo.updatePassword(email, hashedPassword);

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
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!data || !userId) {
        return {
          success: false,
          message: !data ? "Data is required." : "Provider is required.",
        };
      }

      const provider = await this.providerRepo.findById(userId);
      if (!provider) {
        return { success: false, message: "Provider does not exist." };
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

          if (provider.profile_picture) {
            try {
              await this.s3Service.delete_File([provider.profile_picture]);
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

      await this.providerRepo.update(userId, data);
      return { success: true, message: "Profile updated successfully." };
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

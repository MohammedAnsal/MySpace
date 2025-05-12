import { Service } from "typedi";
import { HttpStatus } from "../../../enums/http.status";
import { IUser } from "../../../models/user.model";
import { ProviderRepository } from "../../../repositories/implementations/provider/provider.repository";
import { AppError } from "../../../utils/error";
import { IProviderService } from "../../interface/provider/provider.service.interface";
import { comparePassword, hashPassword } from "../../../utils/password.utils";
import { S3Service, s3Service } from "../s3/s3.service";
import { IHostelRepository } from "../../../repositories/interfaces/provider/hostel.Irepository";
import { hostelRepository } from "../../../repositories/implementations/provider/hostel.repository";
import { UserRepository } from "../../../repositories/implementations/user/user.repository";
import { IBookingRepository } from "../../../repositories/interfaces/user/booking.Irepository";
import { bookingRepository } from "../../../repositories/implementations/user/booking.repository";
import { AdminFacilityResult } from "../../interface/admin/facility.service.interface";

@Service()
export class ProviderService implements IProviderService {
  private s3Service: s3Service;
  private hostelRepo: IHostelRepository;
  private bookingRepo: IBookingRepository;

  constructor(
    private userRepo: UserRepository,
    private providerRepo: ProviderRepository
  ) {
    this.s3Service = S3Service;
    this.hostelRepo = hostelRepository;
    this.bookingRepo = bookingRepository;
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

  async getProviderDashboard(providerId: string): Promise<any> {
    try {
      // const totalHostels = await this.hostelRepo.getAllHostels();
      const totalUsers = await this.userRepo.findUserByRole("user");
      const totalBookings = await this.bookingRepo.getProviderBookings(
        providerId
      );
      const hostels = (await this.hostelRepo.getAllHostels(providerId)).length;

      // const hostels = totalHostels.length;
      const bookings = totalBookings.length;
      const users = totalUsers.length;

      // Calculate total revenue (from completed bookings only)
      const totalRevenue = totalBookings
        .filter((booking) => booking.paymentStatus === "completed")
        .reduce((sum, booking) => sum + booking.totalPrice, 0);

      // Get current date
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      // Calculate weekly revenue (last 7 weeks)
      const weeklyRevenue = [];
      for (let i = 6; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(currentDate.getDate() - (i * 7 + 7));
        const weekEnd = new Date();
        weekEnd.setDate(currentDate.getDate() - i * 7);

        const weeklyBookings = totalBookings.filter(
          (booking) =>
            new Date(booking.bookingDate) >= weekStart &&
            new Date(booking.bookingDate) < weekEnd &&
            booking.paymentStatus === "completed"
        );

        const weekRevenue = weeklyBookings.reduce(
          (sum, booking) => sum + booking.totalPrice,
          0
        );

        weeklyRevenue.push({
          week: `Week ${6 - i + 1}`,
          revenue: weekRevenue,
        });
      }

      // Calculate monthly revenue (for current year)
      const monthlyRevenue = Array(12)
        .fill(0)
        .map((_, index) => {
          const monthBookings = totalBookings.filter((booking) => {
            const bookingDate = new Date(booking.bookingDate);
            return (
              bookingDate.getMonth() === index &&
              bookingDate.getFullYear() === currentYear &&
              booking.paymentStatus === "completed"
            );
          });

          const monthRevenue = monthBookings.reduce(
            (sum, booking) => sum + booking.totalPrice,
            0
          );

          return {
            month: new Date(currentYear, index).toLocaleString("default", {
              month: "short",
            }),
            revenue: monthRevenue,
          };
        });

      // Calculate yearly revenue (last 3 years)
      const yearlyRevenue = [];
      for (let i = 2; i >= 0; i--) {
        const year = currentYear - i;

        const yearBookings = totalBookings.filter((booking) => {
          const bookingDate = new Date(booking.bookingDate);
          return (
            bookingDate.getFullYear() === year &&
            booking.paymentStatus === "completed"
          );
        });

        const yearRevenue = yearBookings.reduce(
          (sum, booking) => sum + booking.totalPrice,
          0
        );

        yearlyRevenue.push({
          year,
          revenue: yearRevenue,
        });
      }

      return {
        hostels,
        bookings,
        users,
        totalRevenue,
        revenueData: {
          weekly: weeklyRevenue,
          monthly: monthlyRevenue,
          yearly: yearlyRevenue,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "An unexpected error occurred while fetching the provider dashboard. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllFacilities(): Promise<AdminFacilityResult> {
    try {
      const facilities = await this.providerRepo.findAllFacilities();

      return {
        success: true,
        message: "Facilities fetched successfully",
        facilityData: facilities,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while fetching facilities. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

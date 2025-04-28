import Container, { Service } from "typedi";
import { IUser } from "../../../models/user.model";
import { UserRepository } from "../../../repositories/implementations/user/user.repository";
import {
  AdminResult,
  IAdminUserService,
} from "../../interface/admin/user.admin.service.interface";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { IAdminRepository } from "../../../repositories/interfaces/admin/admin.Irepository";
import { adminRepository } from "../../../repositories/implementations/admin/admin.repository";
import { s3Service } from "../../../services/implements/s3/s3.service";
import { IHostelRepository } from "../../../repositories/interfaces/provider/hostel.Irepository";
import { hostelRepository } from "../../../repositories/implementations/provider/hostel.repository";
import { IBookingRepository } from "../../../repositories/interfaces/user/booking.Irepository";
import { bookingRepository } from "../../../repositories/implementations/user/booking.repository";
import { walletService } from "../wallet/wallet.service";
import { IWalletService } from "../../interface/wallet/wallet.service.interface";

@Service()
export class AdminUserService implements IAdminUserService {
  private adminRepositoryy: IAdminRepository;
  private s3ServiceInstance: s3Service;
  private hostelRepo: IHostelRepository;
  private bookingRepo: IBookingRepository;

  constructor(private userRepo: UserRepository, s3Service: s3Service) {
    this.adminRepositoryy = adminRepository;
    this.s3ServiceInstance = s3Service;
    this.hostelRepo = hostelRepository;
    this.bookingRepo = bookingRepository;
  }

  async createWallet(adminId: string) {
    try {
      // Create admin wallet
      try {
        const adminWallet = await walletService.createAdminWallet(adminId);
        if (adminWallet) {
          return adminWallet;
        } else {
          throw new AppError("faild to add admin wallet");
        }
      } catch (walletError) {
        console.error("Error creating wallet for provider:", walletError);
        // Don't fail the verification process if wallet creation fails
      }
    } catch (error) {}
  }

  async findAllUser(): Promise<{ success: boolean; data: IUser[] }> {
    try {
      const allUsers = await this.userRepo.findUserByRole("user");

      if (allUsers) {
        return { success: true, data: allUsers };
      } else {
        throw new AppError("faild to fetch user");
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while finding users. Please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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

        return { success: true, message: "User status updated" };
      } else {
        return { success: false, message: "User status didn't updated" };
      }
    } catch (error) {
      throw new Error("internal error");
    }
  }

  async verifyHostel(
    hostelId: string,
    reason: string,
    isVerified: boolean,
    isRejected: boolean
  ): Promise<AdminResult> {
    try {
      if (!hostelId) {
        throw new AppError("Hostel ID is required", HttpStatus.BAD_REQUEST);
      }

      const result = await this.adminRepositoryy.verifyHostel(
        hostelId,
        reason,
        isVerified,
        isRejected
      );

      if (!result) {
        throw new AppError("Hostel not found", HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: isVerified
          ? "Hostel verified successfully"
          : "Hostel rejected successfully",
        data: result,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while verifying hostel",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUnverifiedHostels(): Promise<AdminResult> {
    try {
      const hostels = await this.adminRepositoryy.getUnverifiedHostels();

      return {
        success: true,
        message: "Unverified hostels fetched successfully",
        data: hostels,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while fetching unverified hostels",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getVerifiedHostels(): Promise<AdminResult> {
    try {
      const hostels = await this.adminRepositoryy.getVerifiedHostels();
      return {
        success: true,
        message: "Verified hostels fetched successfully",
        data: hostels,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while fetching verified hostels",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getHostelById(hostelId: string): Promise<AdminResult> {
    try {
      if (!hostelId) {
        throw new AppError("Hostel ID is required", HttpStatus.BAD_REQUEST);
      }

      const hostel = await this.adminRepositoryy.getHostelById(hostelId);

      if (!hostel) {
        throw new AppError("Hostel not found", HttpStatus.NOT_FOUND);
      }

      if (hostel.photos && hostel.photos.length > 0) {
        const signedPhotos = await Promise.all(
          hostel.photos.map((photo) =>
            this.s3ServiceInstance.generateSignedUrl(photo)
          )
        );
        hostel.photos = signedPhotos;
      }

      return {
        success: true,
        message: "Hostel details fetched successfully",
        data: hostel,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while fetching hostel details",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAdminDashboard(): Promise<any> {
    try {
      const totalHostels = await this.hostelRepo.getAllHostels();
      const totalUsers = await this.userRepo.findUserByRole("user");
      const totalProviders = await this.userRepo.findUserByRole("provider");
      const totalBookings = await this.bookingRepo.getAllBookings();

      const hostels = totalHostels.length;
      const bookings = totalBookings.length;
      const users = totalUsers.length;
      const providers = totalProviders.length;

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
        providers,
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
}

export const adminService = Container.get(AdminUserService);

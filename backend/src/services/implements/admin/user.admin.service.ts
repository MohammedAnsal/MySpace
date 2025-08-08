import Container, { Service } from "typedi";
import { UserRepository } from "../../../repositories/implementations/user/user.repository";
import { IAdminUserService } from "../../interface/admin/user.admin.service.interface";
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
import { INotificationService } from "../../interface/notification/notification.service.interface";
import { notificationService } from "../notification/notification.service";
import { Types } from "mongoose";
import {
  AdminSearchDTO,
  AdminVerifyHostelDTO,
  AdminUserResponseDTO,
  AdminUserUpdateResponseDTO,
  AdminHostelResponseDTO,
  AdminDashboardResponseDTO,
  AdminWalletDTO,
} from "../../../dtos/admin/user.dto";
import socketService from "../socket/socket.service";

@Service()
export class AdminUserService implements IAdminUserService {
  private adminRepositoryy: IAdminRepository;
  private s3ServiceInstance: s3Service;
  private hostelRepo: IHostelRepository;
  private bookingRepo: IBookingRepository;
  private notificationService: INotificationService;

  constructor(private userRepo: UserRepository, s3Service: s3Service) {
    this.adminRepositoryy = adminRepository;
    this.s3ServiceInstance = s3Service;
    this.hostelRepo = hostelRepository;
    this.bookingRepo = bookingRepository;
    this.notificationService = notificationService;
  }

  //  Admin create wallet :-

  async createWallet(adminId: string): Promise<AdminWalletDTO> {
    try {
      const adminWallet = await walletService.createAdminWallet(adminId);
      if (!adminWallet) {
        throw new AppError(
          "Failed to add admin wallet",
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        ...adminWallet,
        transactions: [] // Override with empty array to match AdminWalletDTO
      };
    } catch (error) {
      throw new AppError(
        "Failed to create wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Find all user's :-

  async findAllUser(
    data: AdminSearchDTO & { page?: number; limit?: number }
  ): Promise<AdminUserResponseDTO> {
    try {
      const { searchQuery, page = 1, limit = 5 } = data;
      const { users, total } = await this.userRepo.findUserByRole(
        "user",
        page,
        limit,
        searchQuery
      );
      if (!users) {
        throw new AppError("Failed to fetch users", HttpStatus.BAD_REQUEST);
      }
      return { success: true, data: users, total, page, limit };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch users",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Find all provider's :-

  async findAllProvider(
    data: AdminSearchDTO & { page?: number; limit?: number }
  ): Promise<AdminUserResponseDTO> {
    try {
      const { searchQuery, page = 1, limit = 5 } = data;
      const { users, total } = await this.userRepo.findUserByRole(
        "provider",
        page,
        limit,
        searchQuery
      );
      if (!users) {
        throw new AppError("Failed to fetch providers", HttpStatus.BAD_REQUEST);
      }

      // Generate signed URLs for document images
      const providersWithSignedUrls = await Promise.all(
        users.map(async (provider) => {
          let signedDocumentImage = "";
          if (provider.documentImage) {
            signedDocumentImage =
              await this.s3ServiceInstance.generateSignedUrl(
                provider.documentImage
              );
          }

          return {
            ...provider.toObject(),
            documentImage: signedDocumentImage,
          };
        })
      );

      return {
        success: true,
        data: providersWithSignedUrls,
        total,
        page,
        limit,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch providers",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Update user status :-

  async updateUser(email: string): Promise<AdminUserUpdateResponseDTO> {
    try {
      const findUser = await this.userRepo.findUserByEmail(email);
      if (!findUser) {
        return { success: false, message: "User not found" };
      }

      findUser.is_active = !findUser.is_active;
      await findUser.save();

      return {
        success: true,
        message:
          findUser.role === "user"
            ? "User status updated"
            : "Provider status updated",
      };
    } catch (error) {
      throw new AppError("Internal error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //  Verify provider document :-

  async verifyProviderDocument(
    email: string
  ): Promise<AdminUserUpdateResponseDTO> {
    try {
      const findProvider = await this.userRepo.findUserByEmail(email);
      console.log(findProvider);
      if (!findProvider) {
        return { success: false, message: "Provider not found" };
      }

      if (findProvider.role !== "provider") {
        return { success: false, message: "User is not a provider" };
      }

      if (!findProvider.documentImage) {
        return {
          success: false,
          message: "Provider has not uploaded any document",
        };
      }

      findProvider.isDocumentVerified = true;
      await findProvider.save();

      // Create notification
      const notification = await this.notificationService.createNotification({
        recipient: new Types.ObjectId(findProvider._id),
        sender: new Types.ObjectId(process.env.ADMIN_ID!),
        title: "Document Verification",
        message:
          "Your document has been verified successfully. You can now access all provider features.",
        type: "message",
      });

      // Emit socket notification
      socketService.emitNotification(String(findProvider._id), {
        ...notification,
        recipient: notification.recipient.toString(),
      });

      return {
        success: true,
        message: "Provider document verified successfully",
      };
    } catch (error) {
      throw new AppError("Internal error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //  Verify hostel :-

  async verifyHostel(
    data: AdminVerifyHostelDTO
  ): Promise<AdminHostelResponseDTO> {
    try {
      const { hostelId, reason, isVerified, isRejected } = data;
      if (!hostelId) {
        throw new AppError("Hostel ID is required", HttpStatus.BAD_REQUEST);
      }

      const result = await this.adminRepositoryy.verifyHostel(
        hostelId,
        reason,
        isVerified,
        isRejected
      );

      const providerId = await this.hostelRepo
        .findHostelByIdUnPopulated(hostelId)
        .then((data) => data?.provider_id);

      if (providerId) {
        await this.notificationService.createNotification({
          recipient: new Types.ObjectId(String(providerId)),
          sender: new Types.ObjectId(process.env.ADMIN_ID!),
          title: "Hostel Verification",
          message: `Your hostel "${result?.hostel_name}" has been ${
            isVerified ? "verified" : "rejected"
          }.`,
          type: "hostel",
        });
      }

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
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to verify hostel",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Find un-verified hostel's :-

  async getUnverifiedHostels(): Promise<AdminHostelResponseDTO> {
    try {
      const hostels = await this.adminRepositoryy.getUnverifiedHostels();
      return {
        success: true,
        message: "Unverified hostels fetched successfully",
        data: hostels,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch unverified hostels",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Find verified hostel's :-

  async getVerifiedHostels(): Promise<AdminHostelResponseDTO> {
    try {
      const hostels = await this.adminRepositoryy.getVerifiedHostels();
      return {
        success: true,
        message: "Verified hostels fetched successfully",
        data: hostels,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch verified hostels",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Find single hostel :-

  async getHostelById(hostelId: string): Promise<AdminHostelResponseDTO> {
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
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch hostel details",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get dashboard :- (Admin)

  async getAdminDashboard(): Promise<AdminDashboardResponseDTO> {
    try {
      const totalUsers = await this.userRepo.findUserByRole("user");
      const totalProviders = await this.userRepo.findUserByRole("provider");
      const totalBookings = await this.bookingRepo.getAllBookings();

      const bookings = totalBookings.length;
      const users = totalUsers.total;
      const providers = totalProviders.total;

      const totalRevenue = totalBookings
        .filter((booking) => booking.paymentStatus === "completed")
        .reduce((sum, booking) => sum + booking.totalPrice, 0);

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      // Weekly revenue calculation
      const weeklyRevenue = Array.from({ length: 7 }, (_, i) => {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - (i * 7 + 7));
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(currentDate.getDate() - i * 7);

        const weeklyBookings = totalBookings.filter(
          (booking) =>
            new Date(booking.bookingDate) >= weekStart &&
            new Date(booking.bookingDate) < weekEnd &&
            booking.paymentStatus === "completed"
        );

        return {
          week: `Week ${7 - i}`,
          revenue: weeklyBookings.reduce(
            (sum, booking) => sum + booking.totalPrice,
            0
          ),
        };
      }).reverse();

      // Monthly revenue calculation
      const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
        const monthBookings = totalBookings.filter((booking) => {
          const bookingDate = new Date(booking.bookingDate);
          return (
            bookingDate.getMonth() === index &&
            bookingDate.getFullYear() === currentYear &&
            booking.paymentStatus === "completed"
          );
        });

        return {
          month: new Date(currentYear, index).toLocaleString("default", {
            month: "short",
          }),
          revenue: monthBookings.reduce(
            (sum, booking) => sum + booking.totalPrice,
            0
          ),
        };
      });

      // Yearly revenue calculation
      const yearlyRevenue = Array.from({ length: 3 }, (_, i) => {
        const year = currentYear - i;
        const yearBookings = totalBookings.filter((booking) => {
          const bookingDate = new Date(booking.bookingDate);
          return (
            bookingDate.getFullYear() === year &&
            booking.paymentStatus === "completed"
          );
        });

        return {
          year,
          revenue: yearBookings.reduce(
            (sum, booking) => sum + booking.totalPrice,
            0
          ),
        };
      });

      return {
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
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch dashboard data",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const adminService = Container.get(AdminUserService);

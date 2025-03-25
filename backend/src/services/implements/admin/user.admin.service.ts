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

@Service()
export class AdminUserService implements IAdminUserService {
  private adminRepositoryy: IAdminRepository;
  private s3ServiceInstance: s3Service;

  constructor(private userRepo: UserRepository, s3Service: s3Service) {
    this.adminRepositoryy = adminRepository;
    this.s3ServiceInstance = s3Service;
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

        console.log(findUser, "afterrrr");

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
    isVerified: boolean
  ): Promise<AdminResult> {
    try {
      if (!hostelId) {
        throw new AppError("Hostel ID is required", HttpStatus.BAD_REQUEST);
      }

      const result = await this.adminRepositoryy.verifyHostel(
        hostelId,
        isVerified
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
}

export const adminService = Container.get(AdminUserService);

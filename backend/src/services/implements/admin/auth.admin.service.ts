import Container, { Service } from "typedi";
import { adminRepository } from "../../../repositories/implementations/admin/admin.repository";
import { IAdminAuthService } from "../../interface/admin/auth.admin.service.interface";
import {
  AdminSignInDTO,
  AdminForgotPasswordDTO,
  AdminResetPasswordDTO,
  AdminSignInResponseDTO,
  AdminForgotPasswordResponseDTO,
  AdminResetPasswordResponseDTO,
  AdminTokenResponseDTO,
  AdminTokenPayloadDTO,
} from "../../../dtos/admin/auth.dto";
import { comparePassword, hashPassword } from "../../../utils/password.utils";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt.utils";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { IAdminRepository } from "../../../repositories/interfaces/admin/admin.Irepository";

@Service()
export class AdminAuthService implements IAdminAuthService {
  private adminRepo: IAdminRepository;

  constructor() {
    this.adminRepo = adminRepository;
  }

  //  Admin signIn :-

  async admin_signIn(data: AdminSignInDTO): Promise<AdminSignInResponseDTO> {
    try {
      const { email, password } = data;

      if (!email || !password) {
        throw new AppError(
          "Email and password are required",
          HttpStatus.BAD_REQUEST
        );
      }

      const exists = await this.adminRepo.findByEmail(email);

      if (!exists) {
        throw new AppError("Unauthorized User", HttpStatus.UNAUTHORIZED);
      }

      const isPasswordValid = await comparePassword(password, exists.password);

      if (!isPasswordValid) {
        throw new AppError("Incorrect Password", HttpStatus.UNAUTHORIZED);
      }

      const tokenPayload: AdminTokenPayloadDTO = {
        id: String(exists._id),
        role: "admin",
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      return {
        success: true,
        message: "Login Successfully...",
        email: email,
        role: "admin",
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while signing in. Please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Forgot password :-

  async forgotPassword(
    data: AdminForgotPasswordDTO
  ): Promise<AdminForgotPasswordResponseDTO> {
    try {
      const { email } = data;
      const existingAdmin = await this.adminRepo.findByEmail(email);

      if (!existingAdmin) {
        throw new AppError(
          "You are not a verified admin.",
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        success: true,
        message: "OTP sent for resetting your password.",
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while processing forgot password request.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Re-set password :-

  async resetPassword(
    data: AdminResetPasswordDTO
  ): Promise<AdminResetPasswordResponseDTO> {
    try {
      const { email, newPassword } = data;
      const findUser = await this.adminRepo.findByEmail(email);

      if (!findUser) {
        throw new AppError("Invalid Admin details", HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await hashPassword(newPassword);
      const changedPassword = await this.adminRepo.updatePassword(
        email,
        hashedPassword
      );

      if (!changedPassword) {
        throw new AppError(
          "Failed to update the password",
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        success: true,
        message: "Password successfully changed",
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while resetting password.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Set newToken :-

  async checkToken(token: string): Promise<AdminTokenResponseDTO> {
    try {
      const response = verifyRefreshToken(token);
      if (
        typeof response === "object" &&
        response !== null &&
        "id" in response
      ) {
        const newAccessToken = generateAccessToken({
          id: response.id,
          role: "admin",
        });
        return {
          success: true,
          message: "New token created",
          token: newAccessToken,
        };
      }
      throw new AppError("Invalid token", HttpStatus.UNAUTHORIZED);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while verifying refresh token.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const adminAuthService = Container.get(AdminAuthService);

import { Service } from "typedi";
import { AdminRepository } from "../../../repositories/implementations/admin/admin.repository";
import {
  IAdminAuthService,
  SignInResult,
} from "../../interface/admin/auth.admin.service.interface";
import { comparePassword, hashPassword } from "../../../utils/password.utils";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt.utils";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { AuthResponse } from "../../../types/types";

@Service()
export class AdminAuthService implements IAdminAuthService {
  private adminRepo: AdminRepository;

  constructor() {
    this.adminRepo = new AdminRepository();
  }

  async admin_signIn(email: string, password: string): Promise<SignInResult> {
    try {
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

      const accessToken = generateAccessToken({
        id: exists._id,
        role: "admin",
      });

      const refreshToken = generateRefreshToken({
        id: exists._id,
        role: "admin",
      });

      return {
        success: true,
        message: "Login Successfully...",
        accessToken,
        refreshToken,
        email: email,
        role: "admin",
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

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
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
      console.error("Error during forgot password process:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while forgot password.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resetPassword(
    email: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      const findUser = await this.adminRepo.findByEmail(email);

      console.log("the admin from db in resetpassword", findUser);

      if (!findUser)
        throw new AppError("Invalide Admin details", HttpStatus.BAD_REQUEST);

      const hashedPassword = await hashPassword(newPassword);

      const changedPassword = await this.adminRepo.updatePassword(
        email,
        hashedPassword
      );

      if (!changedPassword) {
        throw new AppError(
          "failed to update the password",
          HttpStatus.BAD_REQUEST
        );
      }

      return { success: true, message: "password successfully changed" };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while re-setpassword.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async checkToken(token: string) {
    try {
      const response = verifyRefreshToken(token);
      if (
        typeof response === "object" &&
        response !== null &&
        "id" in response
      ) {
        const newAccessToken = generateAccessToken({
          email: response.email,
          id: response.id,
        });
        return {
          success: true,
          message: "new token created",
          token: newAccessToken,
        };
      }
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

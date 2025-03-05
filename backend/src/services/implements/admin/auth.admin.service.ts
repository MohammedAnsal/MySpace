import { Service } from "typedi";
import { AdminRepository } from "../../../repositories/implementations/admin/admin.repository";
import {
  IAdminAuthService,
  SignInResult,
} from "../../interface/admin/auth.admin.service.interface";
import { comparePassword } from "../../../utils/password.utils";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt.utils";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";

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
        id: exists.id,
        email: exists.email,
      });

      const refreshToken = generateRefreshToken({
        id: exists.id,
        email: exists.email,
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

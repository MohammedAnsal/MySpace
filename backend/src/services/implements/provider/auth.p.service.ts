import { Service } from "typedi";
import bcrypt from "bcryptjs";
import { IOtp } from "../../../interface/otp.Imodel";
import { OtpRepository } from "../../../repositories/implementations/user/otp.repository";
import { sendOtpMail } from "../../../utils/email.utils";
import { generateOtp } from "../../../utils/otp.utils";
import { IAuthService } from "../../interface/provider/auth.p.service.interface";
import { ProviderRepository } from "../../../repositories/implementations/provider/provider.repository";
import { IUser } from "../../../models/user.model";
import { hashPassword } from "../../../utils/password.utils";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt.utils";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { AuthResponse, SignInResult } from "../../../types/types";
import { walletService } from "../wallet/wallet.service";

@Service()
export class AuthProviderService implements IAuthService {
  private providerRepo: ProviderRepository;
  private otpRepo: OtpRepository;

  constructor() {
    this.providerRepo = new ProviderRepository();
    this.otpRepo = new OtpRepository();
  }

  async signUp(providerData: IUser): Promise<AuthResponse> {
    try {
      const { fullName, email, phone, password, gender } = providerData;

      if (!email || !password) {
        throw new AppError(
          "Email and password are required",
          HttpStatus.BAD_REQUEST
        );
      }

      const existingUser = await this.providerRepo.findProviderByEmail(email);

      if (existingUser && existingUser.is_verified) {
        throw new AppError(
          "Provider already registered with this email, Please login...",
          HttpStatus.BAD_REQUEST
        );
      }

      if (existingUser && !existingUser.is_verified) {
        const getOtp = await this.otpRepo.findOtpByEmail(email);

        if (getOtp) {
          const currentTime = new Date().getTime();
          const expirationTime =
            new Date(getOtp.createdAt).getTime() + 5 * 60 * 1000;

          if (currentTime < expirationTime) {
            throw new AppError(
              "OTP is still valid. Please verify using the same OTP.",
              HttpStatus.BAD_REQUEST
            );
          }
        }
        const newOtp = generateOtp();
        await this.otpRepo.createOtp({ email, otp: newOtp } as IOtp);
        await sendOtpMail(email, "Registration", newOtp);
        return {
          success: true,
          message: "New OTP has been sent to your email.",
        };
      }

      const hashedPassword = await hashPassword(password);
      await this.providerRepo.create({
        fullName,
        email,
        phone,
        password: hashedPassword,
        role: "provider",
        gender,
      } as IUser);

      const newOtp = generateOtp();
      await this.otpRepo.createOtp({ email, otp: newOtp } as IOtp);
      await sendOtpMail(email, "Registration", newOtp);

      return { success: true, message: "Email with OTP has been sent" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while signing up",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async signIn(email: string, password: string): Promise<SignInResult> {
    try {
      const existingUser = await this.providerRepo.findProviderByEmail(email);

      if (!existingUser) {
        throw new AppError("Invalid Credentials", HttpStatus.BAD_REQUEST);
      }

      const passwordCheck = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!passwordCheck) {
        throw new AppError("Incorrect Password", HttpStatus.BAD_REQUEST);
      }

      if (existingUser.role !== "provider") {
        throw new AppError("Unauthorized User", HttpStatus.BAD_REQUEST);
      }

      if (!existingUser.is_verified) {
        throw new AppError(
          "Please verify your email first",
          HttpStatus.UNAUTHORIZED
        );
      }

      if (existingUser.is_active === false) {
        throw new AppError(
          "Your account has been blocked",
          HttpStatus.UNAUTHORIZED
        );
      }

      const accessToken = generateAccessToken({
        id: existingUser._id,
        role: existingUser.role,
      });
      const refreshToken = generateRefreshToken({ id: existingUser._id });

      return {
        success: true,
        message: "Sign in successfully completed",
        accessToken,
        refreshToken,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while signing in",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyOtp(otpData: AuthResponse): Promise<AuthResponse> {
    try {
      const { email, otp } = otpData;

      if (!email) {
        throw new AppError(
          "Email is required for OTP verification",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!otp) {
        throw new AppError("OTP is required", HttpStatus.BAD_REQUEST);
      }

      const validUser = await this.providerRepo.findProviderByEmail(email);
      if (!validUser) {
        throw new AppError("Email is not registered", HttpStatus.BAD_REQUEST);
      }

      const getOtp = await this.otpRepo.findOtpByEmail(email);
      if (!getOtp) {
        throw new AppError(
          "No OTP found for this email",
          HttpStatus.BAD_REQUEST
        );
      }

      if (getOtp.otp !== otp) {
        throw new AppError("Invalid OTP", HttpStatus.BAD_REQUEST);
      }

      await this.providerRepo.verifyProvider(email, true);
      
      // Create wallet for provider after verification
      try {
        await walletService.createProviderWallet(validUser._id.toString());
      } catch (walletError) {
        console.error("Error creating wallet for provider:", walletError);
        // Don't fail the verification process if wallet creation fails
      }
      
      await this.otpRepo.deleteOtpByEmail(email);

      return { success: true, message: "Verification complete" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while verifying OTP",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resendOtp(email: string): Promise<AuthResponse> {
    try {
      if (!email) {
        throw new AppError("Email is required", HttpStatus.BAD_REQUEST);
      }

      const existingUser = await this.providerRepo.findProviderByEmail(email);
      if (!existingUser) {
        throw new AppError("Email is not registered", HttpStatus.BAD_REQUEST);
      }

      if (existingUser.is_verified) {
        throw new AppError(
          "Provider is already verified",
          HttpStatus.BAD_REQUEST
        );
      }

      const newOtp = generateOtp();
      const existingOtp = await this.otpRepo.findOtpByEmail(email);

      if (existingOtp) {
        await this.otpRepo.updateOtpByEmail(email, newOtp);
      } else {
        await this.otpRepo.createOtp({ email, otp: newOtp } as IOtp);
      }

      await sendOtpMail(email, "Registration", newOtp);
      return { success: true, message: "New OTP sent successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while resending OTP",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

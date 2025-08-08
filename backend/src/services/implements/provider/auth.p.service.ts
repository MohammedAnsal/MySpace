import { Service } from "typedi";
import bcrypt from "bcryptjs";
import { IOtp } from "../../../interface/otp.Imodel";
import { OtpRepository } from "../../../repositories/implementations/user/otp.repository";
import { sendOtpMail } from "../../../utils/email.utils";
import { generateOtp } from "../../../utils/otp.utils";
import { IAuthService } from "../../interface/provider/auth.p.service.interface";
import { ProviderRepository } from "../../../repositories/implementations/provider/provider.repository";
import { IUser } from "../../../models/user.model";
import { hashPassword, RandomPassword } from "../../../utils/password.utils";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt.utils";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { AuthResponse, SignInResult } from "../../../types/types";
import { walletService } from "../wallet/wallet.service";
import { OAuth2Client } from "google-auth-library";
import { StatusCodes } from "http-status-codes";
import {
  SignUpDTO,
  SignInDTO,
  OtpVerificationDTO,
  ResetPasswordDTO,
  GoogleSignInDTO,
} from "../../../dtos/provider/auth.dto";
import { S3Service } from "../s3/s3.service";
import IS3service from "../../interface/s3/s3.service.interface";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Service()
export class AuthProviderService implements IAuthService {
  private providerRepo: ProviderRepository;
  private otpRepo: OtpRepository;
  private s3Service: IS3service;

  constructor() {
    this.providerRepo = new ProviderRepository();
    this.otpRepo = new OtpRepository();
    this.s3Service = S3Service;
  }

  //  Provider signUp :-

  async signUp(providerData: SignUpDTO): Promise<AuthResponse> {
    try {
      const {
        fullName,
        email,
        phone,
        password,
        gender,
        documentType,
        documentImage,
      } = providerData;

      if (!email || !password) {
        throw new AppError(
          "Email and password are required",
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate document verification fields for providers
      if (!documentType || !documentImage) {
        throw new AppError(
          "Document verification is required for provider registration",
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

      // Upload document image to S3
      let documentImageUrl = "";
      if (documentImage) {
        try {
          const uploadResult = await this.s3Service.uploadFile(
            documentImage,
            "documents"
          );
          // Handle both single file and array of files
          documentImageUrl = Array.isArray(uploadResult)
            ? uploadResult[0].Location
            : uploadResult.Location;
        } catch (uploadError) {
          throw new AppError(
            "Failed to upload document image",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }

      const hashedPassword = await hashPassword(password);
      await this.providerRepo.create({
        fullName,
        email,
        phone,
        password: hashedPassword,
        role: "provider",
        gender,
        documentType,
        documentImage: documentImageUrl,
        isDocumentVerified: false, // Will be verified by admin
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

  //  SignIn :-

  async signIn(data: SignInDTO): Promise<SignInResult> {
    try {
      const { email, password } = data;
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

      // Check if document is verified for providers
      if (existingUser.documentType && !existingUser.isDocumentVerified) {
        throw new AppError(
          "Your document verification is pending. Please wait for admin approval.",
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
        userId: existingUser._id,
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

  //  Verify otp :-

  async verifyOtp(data: OtpVerificationDTO): Promise<AuthResponse> {
    try {
      const { email, otp } = data;

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

  //  Re-send otp :-

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

  //  Forgot password :-

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const existingUser = await this.providerRepo.findProviderByEmail(email);

      if (!existingUser) {
        throw new AppError(
          "You are not a verified provider.",
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

  //  Re-set password :-

  async resetPassword(data: ResetPasswordDTO): Promise<AuthResponse> {
    try {
      const { email, newPassword } = data;
      const findUser = await this.providerRepo.findProviderByEmail(email);

      if (!findUser)
        throw new AppError("Invalide Provider details", HttpStatus.BAD_REQUEST);

      const hashedPassword = await hashPassword(newPassword);

      const changedPassword = await this.providerRepo.updatePassword(
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

  //  Google auth :-

  async signInGoogle(data: GoogleSignInDTO): Promise<SignInResult> {
    const { token } = data;
    let user;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new AppError("Invalid token", StatusCodes.BAD_REQUEST);
    }

    const { email, name, picture, sub } = payload;
    if (!email) {
      throw new AppError(
        "Google account does not have an email",
        StatusCodes.BAD_REQUEST
      );
    }

    user = await this.providerRepo.findProviderByEmail(email);

    if (user && user.is_active === false) {
      throw new AppError("Provider account is blocked", StatusCodes.FORBIDDEN);
    }

    if (!user) {
      const pass = await RandomPassword();

      user = await this.providerRepo.create({
        email,
        fullName: name,
        google_id: sub,
        password: pass,
        phone: "",
        profile_picture: picture,
        role: "provider",
        is_verified: true,
      } as IUser);

      // Create wallet for Google sign-in users
      try {
        await walletService.createProviderWallet(user._id.toString());
      } catch (walletError) {
        console.error(
          "Error creating wallet for Google provider:",
          walletError
        );
        // Don't fail the sign-in process if wallet creation fails
      }
    }

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user._id,
      role: user.role,
    });

    return {
      success: true,
      message: "Sign in successfully completed",
      userId: user._id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
    };
  }
}

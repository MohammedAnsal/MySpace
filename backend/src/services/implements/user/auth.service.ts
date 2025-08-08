import Container, { Service } from "typedi";
import bcrypt from "bcryptjs";
import { IOtp } from "../../../interface/otp.Imodel";
import { IUser } from "../../../models/user.model";
import { OtpRepository } from "../../../repositories/implementations/user/otp.repository";
import { UserRepository } from "../../../repositories/implementations/user/user.repository";
import { sendOtpMail } from "../../../utils/email.utils";
import { generateOtp } from "../../../utils/otp.utils";
import { hashPassword, RandomPassword } from "../../../utils/password.utils";
import { addMinutes, isAfter } from "date-fns";
import { AuthResponse, SignInResult } from "../../../types/types";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt.utils";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { IAuthService } from "../../interface/user/auth.service.interface";
import { StatusCodes } from "http-status-codes";
import { OAuth2Client } from "google-auth-library";
import { walletService } from "../wallet/wallet.service";
import {
  GoogleSignInDTO,
  OtpVerificationDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
} from "../../../dtos/user/auth.dto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Service()
class AuthService implements IAuthService {

  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpRepo: OtpRepository
  ) {}

  //  User signUp :-

  async signUp(userData: SignUpDTO): Promise<AuthResponse> {
    try {
      const { fullName, email, phone, password, gender } = userData;

      const existingUser = await this.userRepo.findUserByEmail(email);

      if (existingUser && existingUser.is_verified)
        throw new AppError(
          "User already registered with this email , Please login...",
          HttpStatus.BAD_REQUEST
        );

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
          } else {
            const newOtp = generateOtp();
            await this.otpRepo.createOtp({ email, otp: newOtp } as IOtp);
            await sendOtpMail(email, "Registration", newOtp);
          }
        } else {
          const newOtp = generateOtp();
          await this.otpRepo.createOtp({ email, otp: newOtp } as IOtp);
          await sendOtpMail(email, "Registration", newOtp);
          return {
            success: true,
            message: "OTP Not found , A new OTP has been sent to your email.",
          };
        }
      }

      const hashedPasswordd = await hashPassword(password);
      await this.userRepo.create({
        fullName,
        email,
        phone,
        password: hashedPasswordd,
        gender,
      } as IUser);

      const newOtp = generateOtp();
      await this.otpRepo.createOtp({ email, otp: newOtp } as IOtp);
      await sendOtpMail(email, "Registration", newOtp);
      return { success: true, message: "Email with OTP has been sented" };
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

  //  SignIn :-

  async signIn(data: SignInDTO): Promise<SignInResult> {
    try {
      const { email, password } = data;
      const existingUser = await this.userRepo.findUserByEmail(email);

      if (existingUser?.is_active === false) {
        throw new AppError(
          "Your account has been blocked",
          HttpStatus.UNAUTHORIZED
        );
      }

      if (!existingUser) {
        throw new AppError("Invalid Credentials", HttpStatus.BAD_REQUEST);
      }

      const passwordCheck = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!passwordCheck) {
        throw new AppError("Incorrect password", HttpStatus.BAD_REQUEST);
      }

      if (!existingUser.is_verified) {
        throw new AppError(
          "Please verify your email first",
          HttpStatus.UNAUTHORIZED
        );
      }

      const accessToken = generateAccessToken({
        id: existingUser._id,
        role: existingUser.role,
      });

      const refreshToken = generateRefreshToken({
        id: existingUser._id,
        role: existingUser.role,
      });

      return {
        success: true,
        message: "Sign in successfully completed",
        accessToken: accessToken,
        refreshToken: refreshToken,
        role: existingUser.role,
        fullName: existingUser.fullName,
        email: existingUser.email,
        userId: existingUser._id,
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

  //  Verify otp :-

  async verifyOtp(otpData: OtpVerificationDTO): Promise<AuthResponse> {
    try {
      const { email, otp } = otpData;

      if (!email) {
        throw new AppError(
          "Email is required for OTP verification.",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!otp) {
        throw new AppError("OTP is required.", HttpStatus.BAD_REQUEST);
      }

      const validUser = await this.userRepo.findUserByEmail(email);

      if (!validUser) {
        throw new AppError(
          "Email is not yet registered",
          HttpStatus.BAD_REQUEST
        );
      }

      const getOtp = await this.otpRepo.findOtpByEmail(email);

      if (!getOtp) {
        throw new AppError(
          "No OTP found for this email",
          HttpStatus.BAD_REQUEST
        );
      }

      if (getOtp.otp !== otp) {
        throw new AppError(
          "Invalid OTP. Please try again.",
          HttpStatus.BAD_REQUEST
        );
      }

      await this.userRepo.verifyUser(email, true);

      //  Create Wallet While User SignUp :-

      try {
        await walletService.createUserWallet(validUser._id.toString());
      } catch (walletError) {
        console.error("Error creating wallet:", walletError);
      }

      try {
        await this.otpRepo.deleteOtpByEmail(email);
      } catch (err) {
        console.error("Failed to delete OTP:", err);
        throw new AppError(
          "Verification complete, but failed to remove OTP.",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return { success: true, message: "Verification complete" };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while verifying OTP.",
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

      const existingUser = await this.userRepo.findUserByEmail(email);

      if (!existingUser) {
        throw new AppError("Email is not registered", HttpStatus.BAD_REQUEST);
      }

      if (existingUser.is_verified) {
        throw new AppError("User is already verified", HttpStatus.BAD_REQUEST);
      }

      const newOtp = generateOtp();

      const existingOtp = await this.otpRepo.findOtpByEmail(email);

      if (existingOtp) {
        await this.otpRepo.updateOtpByEmail(email, newOtp);
      } else {
        await this.otpRepo.createOtp({ email, otp: newOtp } as IOtp);
      }

      await sendOtpMail(email, "Registartion", newOtp);
      return { success: true, message: "New OTP sent successfully" };
    } catch (error) {
      console.error("Error in re-send otp:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while re-send OTP.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Forgot password :-

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const existingUser = await this.userRepo.findUserByEmail(email);

      if (!existingUser) {
        throw new AppError(
          "You are not a verified user.",
          HttpStatus.BAD_REQUEST
        );
      }

      const otp = generateOtp();

      const existingOtpRecord = await this.otpRepo.findOtpByEmail(email);

      if (!existingOtpRecord) {
        await this.otpRepo.create({ email, otp } as IOtp);
      } else {
        const isExpired = isAfter(
          new Date(),
          addMinutes(existingOtpRecord.createdAt, 5)
        );

        if (isExpired) {
          await this.otpRepo.create({ email, otp } as IOtp);
        } else {
          await this.otpRepo.updateOtpByEmail(email, otp);
        }
      }

      await sendOtpMail(email, "Forgot Password", otp);

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
      const findUser = await this.userRepo.findUserByEmail(email);

      if (!findUser)
        throw new AppError("Invalide User details", HttpStatus.BAD_REQUEST);

      const hashedPassword = await hashPassword(newPassword);

      const changedPassword = await this.userRepo.updatePassword(
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

    user = await this.userRepo.findUserByEmail(email);

    if (user && user.is_active === false) {
      throw new AppError("User account is blocked", StatusCodes.FORBIDDEN);
    }

    if (!user) {
      const pass = await RandomPassword();

      user = await this.userRepo.create({
        email,
        fullName: name,
        google_id: sub,
        password: pass,
        phone: "",
        profile_picture: picture,
        role: "user",
        is_verified: true,
      } as IUser);

      try {
        await walletService.createUserWallet(user._id.toString());
      } catch (walletError) {
        console.error("Error creating wallet for Google user:", walletError);
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

  //  Set newToken :- (re-freashToken)

  async checkToken(token: string): Promise<AuthResponse> {
    try {
      const response = verifyRefreshToken(token);

      if (
        typeof response === "object" &&
        response !== null &&
        "id" in response
      ) {
        const newAccessToken = generateAccessToken({
          id: response.id,
          role: response.role,
        });
        return {
          success: true,
          message: "new token created",
          token: newAccessToken,
        };
      }

      return {
        success: false,
        message: "Invalid token",
      };
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

export const authService = Container.get(AuthService);

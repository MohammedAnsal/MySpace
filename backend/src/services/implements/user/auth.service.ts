import { Service } from "typedi";
import bcrypt from "bcryptjs";
import { IOtp } from "../../../interface/otp.Imodel";
import { IUser } from "../../../models/user.model";
import { OtpRepository } from "../../../repositories/implementations/user/otp.repository";
import { UserRepository } from "../../../repositories/implementations/user/user.repository";
import { sendOtpMail } from "../../../utils/email.utils";
import { generateOtp } from "../../../utils/otp.utils";
import { hashPassword } from "../../../utils/password.utils";
import {
  AuthResponse,
  IAuthService,
  OtpVerificationData,
  SignInResult,
} from "../../interface/user/auth.service.interface";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt.utils";

@Service()
export class AuthService implements IAuthService {
  private userRepo: UserRepository;
  private otpRepo: OtpRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.otpRepo = new OtpRepository();
  }

  async signUp(userData: IUser): Promise<AuthResponse> {
    try {
      const { fullName, email, phone, password, role, gender } = userData;

      // console.log(fullName, email, phone, password, role, gender);

      // const rolee = role == "provider" ? "provider" : "user";

      const existingUser = await this.userRepo.findUserByEmail(email);

      if (existingUser && existingUser.is_verified)
        //  Exist User & Verified
        return {
          success: false,
          message: "User already registered with this email , Please login...",
        };

      if (existingUser && !existingUser.is_verified) {
        //   Exist User & Not Verified
        const getOtp = await this.otpRepo.findOtpByEmail(email);

        if (getOtp) {
          const currentTime = new Date().getTime();
          const expirationTime =
            new Date(getOtp.createdAt).getTime() + 5 * 60 * 1000;

          if (currentTime < expirationTime) {
            //  Otp Still Valid
            return {
              success: false,
              message: "OTP is still valid. Please verify using the same OTP.",
            };
          } else {
            //    If Not There New One
            const newOtp = generateOtp();
            await this.otpRepo.createOtp({ email, otp: newOtp } as IOtp);
            await sendOtpMail(email, "Registration", newOtp);
          }
        } else {
          //  if no otp newOne
          const newOtp = generateOtp();
          await this.otpRepo.createOtp({ email, otp: newOtp } as IOtp);
          await sendOtpMail(email, "Registration", newOtp);
          return {
            success: true,
            message: "OTP Not found , A new OTP has been sent to your email.",
          };
        }
      }

      //  Lastly Create Everything

      const hashedPasswordd = await hashPassword(password);
      await this.userRepo.create({
        fullName,
        email,
        phone,
        password: hashedPasswordd,
        role,
        gender,
      } as IUser);

      // console.log(newUser, ":-  newww Userrrrrrrr");

      const newOtp = generateOtp();
      await this.otpRepo.createOtp({ email, otp: newOtp } as IOtp);
      await sendOtpMail(email, "Registration", newOtp);
      return { success: true, message: "Email with OTP has been sented" };
    } catch (error) {
      console.error("Error in signUp:", error);
      return {
        success: false,
        message: "An error occurred while signing up. Please try again later.",
      };
    }
  }

  async signIn(email: string, password: string): Promise<SignInResult> {
    try {
      const existingUser = await this.userRepo.findUserByEmail(email);
      console.log(
        existingUser,
        "this is the user that found from database in user from authService"
      );

      if (!existingUser) {
        return { success: false, message: "Invalid Credentials" };
      }

      const passwordCheck = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!passwordCheck) {
        return { success: false, message: "Invalid Credentials" };
      }

      const accessToken = generateAccessToken({
        id: existingUser._id,
        role: existingUser.role,
      });
      const refreshToken = generateRefreshToken({ id: existingUser._id });

      // console.log(accessToken, "the token created for the user");
      // console.log(refreshToken, "the refresh token created for the user");

      return {
        success: true,
        message: "Sign in successfully completed",
        accessToken: accessToken,
        username: existingUser.fullName,
        email: existingUser.email,
      };
    } catch (error) {
      console.error("Error in signIn:", error);
      return {
        success: false,
        message: "An error occurred while signing. Please try again later.",
      };
    }
  }

  async verifyOtp(otpData: OtpVerificationData): Promise<AuthResponse> {
    try {
      const { email, otp } = otpData;

      if (!email) {
        return {
          success: false,
          message: "Email is required for OTP verification.",
        };
      }

      if (!otp) {
        return { success: false, message: "OTP is required." };
      }

      const validUser = await this.userRepo.findUserByEmail(email);
      console.log(validUser, "the valid user in verifyOtp user in authservice");

      if (!validUser) {
        return { success: false, message: "Email is not yet registered" };
      }

      const getOtp = await this.otpRepo.findOtpByEmail(email);
      console.log(getOtp, "the get otp from the email and db");

      if (!getOtp) {
        return { success: false, message: "No OTP found for this email" };
      }

      if (getOtp.otp === otp) {
        console.log("Matched");

        await this.userRepo.verifyUser(email, true);

        try {
          await this.otpRepo.otpDeleteByEmail(email);
        } catch (err) {
          console.error("Failed to delete OTP:", err);
          return {
            success: false,
            message: "Verification complete, but failed to remove OTP.",
          };
        }

        return { success: true, message: "Verification complete" };
      } else {
        return { success: false, message: "OTP verification failed" };
      }
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      return {
        success: false,
        message:
          "An error occurred while verifying OTP. Please try again later.",
      };
    }
  }

  async resendOtp(email: string): Promise<AuthResponse> {
    try {
      if (!email) {
        return { success: false, message: "Email is required" };
      }

      const existingUser = await this.userRepo.findUserByEmail(email);

      if (!existingUser) {
        return { success: false, message: "Email is not registered" };
      }

      if (existingUser.is_verified) {
        return { success: false, message: "User is already verified" };
      }

      const newOtp = generateOtp();

      const existingOtp = await this.otpRepo.findOtpByEmail(email);

      if (existingOtp) {
        await this.otpRepo.updateOtpByEmail(email, newOtp);
        console.log("new otp updated ", email, newOtp);
      } else {
        await this.otpRepo.createOtp({ email, otp: newOtp } as IOtp);
        console.log("new otp created ", newOtp);
      }

      await sendOtpMail(email, "Registartion", newOtp);
      return { success: true, message: "New OTP sent successfully" };
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      return {
        success: false,
        message:
          "An error occurred while verifying OTP. Please try again later.",
      };
    }
  }
}

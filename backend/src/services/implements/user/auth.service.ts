import { Service } from "typedi";
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
} from "../../interface/user/auth.service.interface";

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
      const { fullName, email, phone , password } = userData;

      console.log(fullName, email, phone , password);

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
            await this.otpRepo.create({ email, otp: newOtp } as IOtp);
            await sendOtpMail(email, "Registration", newOtp);
          }
        } else {
          //  if no otp newOne
          const newOtp = generateOtp();
          await this.otpRepo.create({ email, otp: newOtp } as IOtp);
          await sendOtpMail(email, "Registration", newOtp);
          return {
            success: true,
            message: "OTP Not found , A new OTP has been sent to your email.",
          };
        }
      }

      //  Lastly Create Everything

      const hashedPasswordd = await hashPassword(password);
      const newUser = await this.userRepo.create({
        fullName,
        email,
        phone,
        password: hashedPasswordd,
      } as IUser);

      console.log(newUser, ":-  newww Userrrrrrrr");

      const newOtp = generateOtp();
      await this.otpRepo.create({ email, otp: newOtp } as IOtp);
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
}

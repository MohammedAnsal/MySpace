import { IUser } from "../../../models/user.model";
import { OtpVerificationData } from "../../../types/types";
import { AuthResponse, SignInResult } from "../../../types/types";

export interface IAuthService {
  signUp(userData: IUser): Promise<AuthResponse>;
  signIn(email: string, password: string): Promise<AuthResponse>;
  verifyOtp(otpData: OtpVerificationData): Promise<SignInResult>;
  resendOtp(email: string): Promise<AuthResponse>;
  forgotPassword(email: string): Promise<AuthResponse>;
  resetPassword(email: string, newPassword: string): Promise<AuthResponse>;
  signInGoogle(email: string, fullName: string): Promise<AuthResponse>;
}

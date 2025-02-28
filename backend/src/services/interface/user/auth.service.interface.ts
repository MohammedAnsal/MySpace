import { IUser } from "../../../models/user.model";

export interface AuthResponse {
  message: string;
  success: boolean;
  token?: string;
  email?: string;
  otp?: string;
}

export interface SignInResult extends AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  fullName?: string;
  role?: string;
}

export interface OtpVerificationData {
  email: string;
  otp: string;
}

export interface IAuthService {
  signUp(userData: IUser): Promise<AuthResponse>;
  signIn(email: string, password: string): Promise<AuthResponse>;
  verifyOtp(otpData: OtpVerificationData): Promise<SignInResult>;
  resendOtp(email: string): Promise<AuthResponse>;
  forgotPassword(email: string): Promise<AuthResponse>;
  resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<AuthResponse>;
}

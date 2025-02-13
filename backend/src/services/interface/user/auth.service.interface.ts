import { IUser } from "../../../models/user.model";

export interface AuthResponse {
  message: string;
  success: boolean;
  token?: string;
  email?: string;
  otp?: string;
}

export interface IAuthService {
  signUp(userData: IUser): Promise<AuthResponse>;
  // signIn(email: string, password: string): Promise<AuthResponse>;
  verifyOtp(otpData: AuthResponse): Promise<AuthResponse>;
  // resendOtp(token: string, otp: string): Promise<AuthResponse>;
}

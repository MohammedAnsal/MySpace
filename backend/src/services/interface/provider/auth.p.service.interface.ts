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
}

export interface IAuthService {
  signUp(providerData: IUser): Promise<AuthResponse>;
  signIn(email: string, password: string): Promise<AuthResponse>;
  verifyOtp(otpData: AuthResponse): Promise<SignInResult>;
  resendOtp(email: string): Promise<AuthResponse>;
}

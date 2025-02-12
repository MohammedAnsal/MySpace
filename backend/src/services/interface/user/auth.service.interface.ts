import { IUser } from "../../../models/user.model";

export interface AuthResponse {
  message: string;
  success: boolean;
  token?: string;
}

export interface IAuthService {
  signUp(userData: IUser): Promise<AuthResponse>;
  // signIn(email: string, password: string): Promise<AuthResponse>;
  // verifyOtp(token: string, otp: string): Promise<AuthResponse>;
  // resendOtp(token: string, otp: string): Promise<AuthResponse>;
}

// export interface SignUpRequest {
//   name: string;
//   email: string;
//   password: string;
//   role?: "user" | "provider" | "admin"; // Optional, default is 'user'
// }

// export interface SignInRequest {
//   email: string;
//   password: string;
// }

// export interface VerifyOtpRequest {
//   email: string;
//   otp: string;
// }

// export interface ResendOtpRequest {
//   email: string;
// }

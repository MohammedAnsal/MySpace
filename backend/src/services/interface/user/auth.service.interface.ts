import { SignUpDTO, SignInDTO, OtpVerificationDTO, ResetPasswordDTO, GoogleSignInDTO } from "../../../dtos/user/auth.dto";
import { AuthResponse, SignInResult } from "../../../types/types";

export interface IAuthService {
  signUp(userData: SignUpDTO): Promise<AuthResponse>;
  signIn(data: SignInDTO): Promise<SignInResult>;
  verifyOtp(data: OtpVerificationDTO): Promise<SignInResult>;
  resendOtp(email: string): Promise<AuthResponse>;
  forgotPassword(email: string): Promise<AuthResponse>;
  resetPassword(data: ResetPasswordDTO): Promise<AuthResponse>;
  signInGoogle(data: GoogleSignInDTO): Promise<SignInResult>;
}

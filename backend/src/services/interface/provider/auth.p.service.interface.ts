import { IUser } from "../../../models/user.model";
import { AuthResponse, SignInResult } from "../../../types/types";

export interface IAuthService {
  signUp(providerData: IUser): Promise<AuthResponse>;
  signIn(email: string, password: string): Promise<AuthResponse>;
  verifyOtp(otpData: AuthResponse): Promise<SignInResult>;
  resendOtp(email: string): Promise<AuthResponse>;
}

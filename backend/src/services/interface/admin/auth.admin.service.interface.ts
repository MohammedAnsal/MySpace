import { AuthResponse } from "../../../types/types";

export interface SignInResult {
  success: boolean;
  message: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  fullName?: string;
}

export interface IAdminAuthService {
  admin_signIn(email: string, password: string): Promise<SignInResult>;
   forgotPassword(email: string): Promise<AuthResponse>;
    resetPassword(email: string, newPassword: string): Promise<AuthResponse>;
}

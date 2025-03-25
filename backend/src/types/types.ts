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
  pic?:string
}

export interface OtpVerificationData {
  email: string;
  otp: string;
}
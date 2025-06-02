export interface SignUpDTO {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  gender?: "male" | "female" | "other";
}

export interface SignInDTO {
  email: string;
  password: string;
}

export interface OtpVerificationDTO {
  email: string;
  otp: string;
}

export interface ResetPasswordDTO {
  email: string;
  newPassword: string;
}

export interface GoogleSignInDTO {
  token: string;
}

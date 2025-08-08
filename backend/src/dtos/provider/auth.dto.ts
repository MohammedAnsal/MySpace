export interface SignUpDTO {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  gender?: "male" | "female" | "other";
  documentType: "aadhar" | "pan" | "passport" | "driving_license";
  documentImage?: Express.Multer.File;
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

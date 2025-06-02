// Request DTOs
export interface AdminSignInDTO {
  email: string;
  password: string;
}

export interface AdminForgotPasswordDTO {
  email: string;
}

export interface AdminResetPasswordDTO {
  email: string;
  newPassword: string;
}

// Response DTOs
export interface AdminSignInResponseDTO {
  refreshToken: string;
  accessToken: string;
  success: boolean;
  message: string;
  email: string;
  role: string;
}

export interface AdminForgotPasswordResponseDTO {
  success: boolean;
  message: string;
}

export interface AdminResetPasswordResponseDTO {
  success: boolean;
  message: string;
}

export interface AdminTokenResponseDTO {
  success: boolean;
  message: string;
  token?: string;
}

// Internal DTOs (used within the service)
export interface AdminTokenPayloadDTO {
  id: string;
  role: string;
  email?: string;
}

export interface AdminRefreshTokenPayloadDTO {
  id: string;
  role: string;
  email?: string;
}

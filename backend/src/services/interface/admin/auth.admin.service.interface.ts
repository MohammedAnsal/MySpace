import { 
  AdminSignInDTO,
  AdminForgotPasswordDTO,
  AdminResetPasswordDTO,
  AdminSignInResponseDTO,
  AdminForgotPasswordResponseDTO,
  AdminResetPasswordResponseDTO,
  AdminTokenResponseDTO
} from "../../../dtos/admin/auth.dto";

export interface IAdminAuthService {
  admin_signIn(data: AdminSignInDTO): Promise<AdminSignInResponseDTO>;
  forgotPassword(data: AdminForgotPasswordDTO): Promise<AdminForgotPasswordResponseDTO>;
  resetPassword(data: AdminResetPasswordDTO): Promise<AdminResetPasswordResponseDTO>;
  checkToken(token: string): Promise<AdminTokenResponseDTO>;
}

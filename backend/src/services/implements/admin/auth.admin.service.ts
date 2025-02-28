import { Service } from "typedi";
import { AdminRepository } from "../../../repositories/implementations/admin/admin.repository";
import {
  IAdminAuthService,
  SignInResult,
} from "../../interface/admin/auth.admin.service.interface";
import { comparePassword } from "../../../utils/password.utils";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt.utils";

@Service()
export class AdminAuthService implements IAdminAuthService {
  private adminRepo: AdminRepository;

  constructor() {
    this.adminRepo = new AdminRepository();
  }

  async admin_signIn(email: string, password: string): Promise<SignInResult> {
    try {
      const exists = await this.adminRepo.findByEmail(email);

      if (exists) {
        const getPass = await comparePassword(password, exists.password);

        if (!getPass) {
          return { success: false, message: "Invalid Credentials" };
        }

        const accessToken = generateAccessToken({
          id: exists.id,
          email: exists.email,
        });

        const refreshToken = generateRefreshToken({
          id: exists.id,
          email: exists.email,
        });

        return {
          success: true,
          message: "Login Successfully...",
          accessToken: accessToken,
          email: email,
          fullName: exists.fullName,
          role: "admin",
        };
      } else {
        return { success: false, message: "Invalid Credentials" };
      }
    } catch (error) {
      console.error("Error in signIn:", error);
      return {
        success: false,
        message: "An error occurred while signing. Please try again later.",
      };
    }
  }
}

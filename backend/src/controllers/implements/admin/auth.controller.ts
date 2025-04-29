import { Request, Response } from "express";
import { AdminAuthService } from "../../../services/implements/admin/auth.admin.service";
import Container, { Service } from "typedi";
import { HttpStatus, responseMessage } from "../../../enums/http.status";
import { AppError } from "../../../utils/error";
import { setCookie } from "../../../utils/cookies.util";

const AdminId = process.env.ADMIN_ID;

@Service()
export class AdminController {
  constructor(private readonly adminService: AdminAuthService) {}

  async signIn(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const response = await this.adminService.admin_signIn(email, password);

      setCookie(res, "token", String(response.accessToken));
      setCookie(res, "refr_Admin_Token", String(response.refreshToken));

      return res.status(HttpStatus.OK).json({
        success: true,
        message: response.message,
        email: response.email,
        role: response.role,
        token: response.accessToken,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }

      console.error("Error in admin signin:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred while signing in",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<any> {
    try {
      res.clearCookie("refr_Admin_Token", {
        httpOnly: true,
        sameSite: "strict",
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }

      console.error("Error in admin logout:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred while logging out",
      });
    }
  }

  async setNewToken(req: Request, res: Response): Promise<any> {
    try {
      const token = req.cookies?.refr_Admin_Token;

      if (!token) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: responseMessage.ERROR_MESSAGE });
      }

      const response = await this.adminService.checkToken(token);

      if (response?.success) {
        return res.status(HttpStatus.OK).json({ token: response.token });
      } else {
        res.clearCookie("refr_Admin_Token");
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: response?.message });
      }
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in token refresh:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export const authController = Container.get(AdminController);

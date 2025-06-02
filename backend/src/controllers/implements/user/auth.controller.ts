import Container, { Service } from "typedi";
import { IAuthController } from "../../interface/user/auth.controller.interface";
import { AuthService } from "../../../services/implements/user/auth.service";
import { Request, Response } from "express";
import { registerSchema, signInSchema } from "../../../schema/user.Zschema";
import { HttpStatus, responseMessage } from "../../../enums/http.status";
import { setCookie } from "../../../utils/cookies.util";
import { AppError } from "../../../utils/error";
import redisClient from "../../../config/redisConfig";
import { StatusCodes } from "http-status-codes";

@Service()
export class AuthController implements IAuthController {
  constructor(private readonly authSrvice: AuthService) {}

  async signUp(req: Request, res: Response): Promise<any> {
    try {
      const validationCheck = registerSchema.safeParse(req.body);

      if (!validationCheck.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: validationCheck.error.errors[0].message,
        });
      }

      const response = await this.authSrvice.signUp(req.body);
      return res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in signup:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async signIn(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      const validationCheck = signInSchema.safeParse(req.body);

      if (!validationCheck.success) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Invalid credentials" });
      }

      const response = await this.authSrvice.signIn({ email, password });

      setCookie(res, "refreshToken", String(response.refreshToken));
      setCookie(res, "token", String(response.accessToken));

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Sign in successfully completed",
        userId: response.userId,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
        token: response.accessToken,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in signin:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<any> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      const response = await this.authSrvice.verifyOtp({ email, otp });
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in OTP verification:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email is required",
        });
      }

      const response = await this.authSrvice.resendOtp(email);
      return res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in resend OTP:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async forgetPassword(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email is required",
        });
      }

      const response = await this.authSrvice.forgotPassword(email);
      return res
        .status(response.success ? HttpStatus.OK : HttpStatus.UNAUTHORIZED)
        .json({ message: response.message, success: response.success });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in forgot password:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<any> {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and new password are required",
        });
      }

      const response = await this.authSrvice.resetPassword({
        email,
        newPassword,
      });

      if (response.success) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: "Password successfully changed, please login again",
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: response.message,
        });
      }
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in reset password:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async googleSign(req: Request, res: Response): Promise<any> {
    try {
      const { token } = req.body;
      const { fullName, accessToken, refreshToken, email, role, userId } =
        await this.authSrvice.signInGoogle({ token });

      setCookie(res, "refreshToken", String(refreshToken));
      setCookie(res, "token", String(accessToken));

      return res.status(StatusCodes.OK).json({
        message: "Google login successful",
        userId,
        fullName,
        role,
        email,
        success: true,
        token: accessToken,
      });
    } catch (error: any) {
      console.error("Google login error: ", error);
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Google Login Error",
        success: false,
      });
    }
  }

  async setNewToken(req: Request, res: Response): Promise<any> {
    try {
      const token = req.cookies?.refreshToken;

      if (!token) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: responseMessage.ERROR_MESSAGE });
      }

      const response = await this.authSrvice.checkToken(token);

      if (response?.success) {
        return res.status(HttpStatus.OK).json({ token: response.token });
      } else {
        res.clearCookie("refrToken");
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

  async logout(req: Request, res: Response): Promise<any> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(400).json({ message: "No token provided" });
      }

      const tokenExpiration = 7 * 24 * 60 * 60; // 7 days in seconds

      await redisClient.set(refreshToken, "blacklisted", {
        EX: tokenExpiration,
      });

      res.clearCookie("token");
      res.clearCookie("refreshToken");

      res.status(HttpStatus.OK).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    }
  }
}

export const authController = Container.get(AuthController);

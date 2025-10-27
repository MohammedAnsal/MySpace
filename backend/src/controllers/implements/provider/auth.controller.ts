import { Request, Response } from "express";
import { HttpStatus } from "../../../enums/http.status";
import { AuthProviderService } from "../../../services/implements/provider/auth.p.service";
import Container, { Service } from "typedi";
import { setCookie } from "../../../utils/cookies.util";
import { AppError } from "../../../utils/error";
import { IAuthController } from "../../interface/provider/auth.controller.interface";
import redisClient from "../../../config/redisConfig";
import { StatusCodes } from "http-status-codes";

@Service()
export class AuthController implements IAuthController {
  constructor(private readonly providerService: AuthProviderService) {}

  //  Provider signUp :-

  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const providerData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        gender: req.body.gender,
        documentType: req.body.documentType,
        documentImage: req.file, 
      };

      const response = await this.providerService.signUp(providerData);
      return res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in provider signup:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  SignIn :-

  async signIn(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const response = await this.providerService.signIn({ email, password });

      setCookie(res, "provider_rfr", String(response.refreshToken));
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
      console.error("Error in provider signin:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  Verify otp :-

  async verifyOtp(req: Request, res: Response): Promise<Response> {
    try {
      const otpData = req.body;

      if (!otpData) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      const response = await this.providerService.verifyOtp(otpData);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in provider OTP verification:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  Re-send otp :-

  async resendOtp(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email is required",
        });
      }

      const response = await this.providerService.resendOtp(email);
      return res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in provider resend OTP:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  Logout :-

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.provider_rfr;

      if (!refreshToken) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "No token provided" });
      }

      const tokenExpiration = 7 * 24 * 60 * 60; // 7 days in seconds

      await redisClient.set(refreshToken, "provider-blacklisted", {
        EX: tokenExpiration,
      });

      res.clearCookie("token");
      res.clearCookie("provider_rfr");

      return res
        .status(HttpStatus.OK)
        .json({ message: "Logged out successfully" });
    } catch (error) {
      console.log(error)
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    }
  }

  //  Forgot password :-

  async forgetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email is required",
        });
      }

      const response = await this.providerService.forgotPassword(email);
      return res
        .status(response.success ? HttpStatus.OK : HttpStatus.UNAUTHORIZED)
        .json({ message: response.message, success: response.success });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in provider forgot password:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  Re-set password :-

  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email, and new password are required",
        });
      }

      const response = await this.providerService.resetPassword({
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
      console.error("Error in provider reset password:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  Google auth :-

  async googleSign(req: Request, res: Response): Promise<Response> {
    const { token } = req.body;
    try {
      const { fullName, accessToken, refreshToken, email, role, userId } =
        await this.providerService.signInGoogle({ token });

      setCookie(res, "provider_rfr", String(refreshToken));
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
    } catch (error) {
      console.error("Google login error: ", error);
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error || "Google Login Error",
        success: false,
      });
    }
  }
}

export const authController = Container.get(AuthController);

import { Request, Response } from "express";
import { HttpStatus } from "../../../enums/http.status";
import { AuthProviderService } from "../../../services/implements/provider/auth.p.service";
import Container, { Service } from "typedi";
import { setCookie } from "../../../utils/cookies.util";
import { AppError } from "../../../utils/error";
import { IAuthController } from "../../interface/provider/auth.controller.interface";
import redisClient from "../../../config/redisConfig";
@Service()
export class AuthController implements IAuthController {
  constructor(private readonly providerService: AuthProviderService) {}

  async signUp(req: Request, res: Response): Promise<any> {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const response = await this.providerService.signUp(req.body);
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

  async signIn(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      console.log(email , password , 'from pro signIn')

      if (!email || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const response = await this.providerService.signIn(email, password);

      console.log(response,'from con')

      setCookie(res, "provider_rfr", String(response.refreshToken));
      setCookie(res, "token", String(response.accessToken));

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Sign in successfully completed",
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

  async verifyOtp(req: Request, res: Response): Promise<any> {
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

  async resendOtp(req: Request, res: Response): Promise<any> {
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

  async logout(req: Request, res: Response): Promise<any> {
    try {
      const refreshToken = req.cookies.provider_rfr;

      if (!refreshToken) {
        return res.status(400).json({ message: "No token provided" });
      }

      const tokenExpiration = 7 * 24 * 60 * 60; // 7 days in seconds

      await redisClient.set(refreshToken, "provider-blacklisted", {
        EX: tokenExpiration,
      });

      res.clearCookie("token");
      res.clearCookie("provider_rfr");

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

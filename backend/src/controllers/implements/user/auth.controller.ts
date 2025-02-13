import Container, { Service } from "typedi";
import { IAuthController } from "../../interface/user/auth.controller.interface";
import { AuthService } from "../../../services/implements/user/auth.service";
import { Request, Response } from "express";
import { registerSchema } from "../../../schema/user.Zschema";
import { HttpStatus } from "../../../enums/http.status";

@Service()
export class AuthController implements IAuthController {
  private authSrvice: AuthService;

  constructor() {
    this.authSrvice = new AuthService();
  }

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const validationCheck = registerSchema.safeParse(req.body);

      if (!validationCheck.success) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: validationCheck.error.errors[0].message,
        });
      }

      const response = await this.authSrvice.signUp(req.body);

      // console.log(response,'reeesssss')

      res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .json(response);
    } catch (error) {
      console.log("error in the signup auth controller", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const response = await this.authSrvice.signIn(email, password);

      res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .json(response);
    } catch (error) {
      console.error("Error in the signIn auth controller:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const otpData = req.body;
      const response = await this.authSrvice.verifyOtp(otpData);

      if (typeof response === "string") {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: response });
      }

      res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .json(response);
    } catch (error) {
      console.error("Error in the otpVerify auth controller:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const response = await this.authSrvice.resendOtp(email);

      res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .json(response);
    } catch (error) {
      console.error("Error in the re-sendOtp auth controller:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export const authController = Container.get(AuthController);

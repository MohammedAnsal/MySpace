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

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("error in the signup auth controller", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
    } catch (error) {
      console.log("error in the otpVerify auth controller", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export const authController = Container.get(AuthController);

import Container, { Service } from "typedi";
// import { IAuthController } from "../../interface/user/auth.controller.interface";
import { AuthService } from "../../../services/implements/user/auth.service";
import { Request, Response } from "express";
import { registerSchema, signInSchema } from "../../../schema/user.Zschema";
import { HttpStatus } from "../../../enums/http.status";

@Service()
export class AuthController {
  constructor(private readonly authSrvice: AuthService) {}

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      // const validationCheck = registerSchema.safeParse(req.body);

      // if (!validationCheck.success) {
      //   res.status(HttpStatus.BAD_REQUEST).json({
      //     success: false,
      //     message: validationCheck.error.errors[0].message,
      //   });
      //   return;
      // }

      const response = await this.authSrvice.signUp(req.body);

      // console.log(response,'reeesssss')

      res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .json(response);
      return;
    } catch (error) {
      console.log("error in the signup auth controller", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
      return;
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

      const response = await this.authSrvice.signIn(email, password);

      return res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .cookie("refrToken", response.refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json(response);
    } catch (error) {
      console.error("Error in the signIn auth controller:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;

      const response = await this.authSrvice.verifyOtp({ email, otp });

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

  async resendOtp(req: Request, res: Response): Promise<any> {
    try {
      const email = req.body.email

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

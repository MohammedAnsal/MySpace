import { Request, Response } from "express";
import { HttpStatus } from "../../../enums/http.status";
import { AuthProviderService } from "../../../services/implements/provider/auth.p.service";
import Container, { Service } from "typedi";
@Service()
export class AuthController {
  constructor(private readonly providerService: AuthProviderService) {}

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

      const response = await this.providerService.signUp(req.body);

      console.log(response, "reeesssss");

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

      //   const validationCheck = signInSchema.safeParse(req.body);

      //   if (!validationCheck.success) {
      //     return res
      //       .status(HttpStatus.BAD_REQUEST)
      //       .json({ success: false, message: "Invalid credentials" });
      //   }

      const response = await this.providerService.signIn(email, password);

      return res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .cookie("refr_Provider_Token", response.refreshToken, {
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

  async verifyOtp(req: Request, res: Response): Promise<any> {
    try {
      const otpData = req.body;
      console.log(otpData)
      const response = await this.providerService.verifyOtp(otpData);

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
      const { email } = req.body;

      const response = await this.providerService.resendOtp(email);

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

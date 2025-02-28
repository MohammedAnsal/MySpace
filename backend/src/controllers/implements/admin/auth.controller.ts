import { Request, Response } from "express";
import { AdminAuthService } from "../../../services/implements/admin/auth.admin.service";
import Container, { Service } from "typedi";
import { HttpStatus } from "../../../enums/http.status";

@Service()
export class AdminController {
  constructor(private readonly adminService: AdminAuthService) {}

  async signIn(req: Request, res: Response): Promise<any> {
    try {
      const { fullName, email, password } = req.body;

      const response = await this.adminService.admin_signIn(email, password);

      return res
        .status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .cookie("refr_Admin_Token", response.refreshToken, {
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
}

export const authController = Container.get(AdminController);

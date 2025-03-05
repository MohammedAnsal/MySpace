import { Request, Response } from "express";
import { AdminUserService } from "../../../services/implements/admin/user.admin.service";
import { IAdminController } from "../../interface/admin/admin.controller.interface";
import Container, { Service } from "typedi";
import { HttpStatus } from "../../../enums/http.status";

@Service()
class AdminUserController implements IAdminController {
  constructor(private userService: AdminUserService) {}

  async fetchUsers(req: Request, res: Response): Promise<any> {
    const getAllUsers = await this.userService.findAllUser();

    if (getAllUsers) {
      return res.status(200).json(getAllUsers);
    } else {
      throw new Error("failed to  fetch user");
    }
  }

  async fetchProviders(req: Request, res: Response): Promise<any> {
    const getAllProviders = await this.userService.findAllProvider();

    if (getAllProviders) {
      return res.status(200).json(getAllProviders);
    } else {
      throw new Error("failed to fetch providers");
    }
  }

  async updateUser(req: Request, res: Response): Promise<any> {
    const { email } = req.body;

    const findUser = await this.userService.updateUser(email);

    if (findUser) {
      return res.status(200).json(findUser);
    } else {
      throw new Error("Error in updateUser");
    }
  }

  // async logout(req: Request, res: Response): Promise<any> {
  //   try {
  //     res
  //       .clearCookie("refr_Admin_Token")
  //       .status(HttpStatus.OK)
  //       .json({ message: "Logout successfully" });
  //   } catch (error) {
  //     console.log((error as Error).message);
  //     throw new Error("from logout user");
  //   }
  // }
}

export const AdminUserControllerr = Container.get(AdminUserController);

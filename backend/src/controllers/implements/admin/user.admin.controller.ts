import { Request, Response } from "express";
import { AdminUserService } from "../../../services/implements/admin/user.admin.service";
import { IAdminUserController } from "../../interface/admin/auth.controller.interface";
import Container, { Service } from "typedi";

@Service()
class AdminUserController implements IAdminUserController {
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

  async updateUser(req: Request, res: Response): Promise<any> {}
}

export const AdminUserControllerr = Container.get(AdminUserController);

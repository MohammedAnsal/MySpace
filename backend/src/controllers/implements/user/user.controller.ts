import { Request, Response } from "express";
import { UserService } from "../../../services/implements/user/user.service";
import { IUserController } from "../../interface/user/user.controller.inteface";
import { HttpStatus } from "../../../enums/http.status";
import Container, { Service } from "typedi";

@Service()
class UserController implements IUserController {
  constructor(private userServive: UserService) {}

  async logout(req: Request, res: Response): Promise<any> {
    try {
      res
        .clearCookie("refrToken")
        .status(HttpStatus.OK)
        .json({ message: "Logout successfully" });
    } catch (error) {
      console.log((error as Error).message);
      throw new Error("from logout user");
    }
  }
}

export const userController = Container.get(UserController);

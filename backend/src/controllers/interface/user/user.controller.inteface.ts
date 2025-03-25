import { Request, Response } from "express";
import { AuthRequset } from "../../../types/api";

export interface IUserController {
  findUser(req: AuthRequset, res: Response): Promise<any>;
  changePassword(req: Request, res: Response): Promise<any>;
  editProfile(req: AuthRequset, res: Response): Promise<any>;
}

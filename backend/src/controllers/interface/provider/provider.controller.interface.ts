import { Request, Response } from "express";
import { AuthRequset } from "../../../types/api";

export interface IProviderController {
  findUser(req: AuthRequset, res: Response): Promise<any>;
  changePassword(req: Request, res: Response): Promise<any>;
  editProfile(req: AuthRequset, res: Response): Promise<any>;
  getDashboard(req: AuthRequset, res: Response): Promise<any>;
}

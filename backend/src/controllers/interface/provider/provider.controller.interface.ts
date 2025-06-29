import { Request, Response } from "express";
import { AuthRequset } from "../../../types/api";

export interface IProviderController {
  findUser(req: AuthRequset, res: Response): Promise<Response>;
  changePassword(req: Request, res: Response): Promise<Response>;
  editProfile(req: AuthRequset, res: Response): Promise<Response>;
  getDashboard(req: AuthRequset, res: Response): Promise<Response>;
}

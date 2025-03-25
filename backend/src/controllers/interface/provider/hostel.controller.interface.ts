import { Response } from "express";
import { AuthRequset } from "../../../types/api";

export interface IHostelController {
  createHostel(req: AuthRequset, res: Response): Promise<any>;
  getAllHostels(req: AuthRequset, res: Response): Promise<void>;
}

import { Response } from "express";
import { AuthRequset } from "../../../types/api";

export interface IHostelController {
  createHostel(req: AuthRequset, res: Response): Promise<Response>;
  getAllHostels(req: AuthRequset, res: Response): Promise<Response>;
  editHostel(req: AuthRequset, res: Response): Promise<Response>;
  deleteHostel(req: AuthRequset, res: Response): Promise<Response>;
}

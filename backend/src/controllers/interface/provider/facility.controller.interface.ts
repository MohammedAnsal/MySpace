import { Request, Response } from "express";
import { IFacility } from "../../../models/provider/facility.model";
import { AuthRequset } from "../../../types/api";

export type facilityResultController = {
  facilityData?: IFacility;
  success: boolean;
  message: string;
};

export interface IFacilityController {
  createFacility(req: AuthRequset, res: Response): Promise<any>;
  findAllFacility(req: AuthRequset, res: Response): Promise<IFacility[]>;
  updateFacilityStatus(req: AuthRequset, res: Response): Promise<any>;
  deleteFacility(req: AuthRequset, res: Response): Promise<any>;
}

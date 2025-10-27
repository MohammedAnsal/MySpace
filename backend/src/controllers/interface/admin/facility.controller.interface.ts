import { Response } from "express";
import { IAdminFacility } from "../../../models/admin/facility.model";
import { AuthRequset } from "../../../types/api";

export type AdminFacilityResultController = {
  facilityData?: IAdminFacility;
  success: boolean;
  message: string;
};

export interface IAdminFacilityController {
  createFacility(req: AuthRequset, res: Response): Promise<Response>;
  findAllFacilities(req: AuthRequset, res: Response): Promise<Response>;
  updateFacilityStatus(req: AuthRequset, res: Response): Promise<Response>;
  deleteFacility(req: AuthRequset, res: Response): Promise<Response>;
  getFacilityById(req: AuthRequset, res: Response): Promise<Response>;
}

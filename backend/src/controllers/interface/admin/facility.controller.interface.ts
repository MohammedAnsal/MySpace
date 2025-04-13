import { Request, Response } from "express";
import { IAdminFacility } from "../../../models/admin/facility.model";
import { AuthRequset } from "../../../types/api";

export type AdminFacilityResultController = {
  facilityData?: IAdminFacility;
  success: boolean;
  message: string;
};

export interface IAdminFacilityController {
  createFacility(req: AuthRequset, res: Response): Promise<any>;
  findAllFacilities(req: AuthRequset, res: Response): Promise<any>;
  updateFacilityStatus(req: AuthRequset, res: Response): Promise<any>;
  deleteFacility(req: AuthRequset, res: Response): Promise<any>;
  getFacilityById(req: AuthRequset, res: Response): Promise<any>;
} 
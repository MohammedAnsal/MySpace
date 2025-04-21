import { Request, Response } from "express";

export interface IAdminController {
  fetchUsers(req: Request, res: Response): Promise<any>;
  fetchProviders(req: Request, res: Response): Promise<any>;
  updateUser(req: Request, res: Response): Promise<any>;
  
  
}

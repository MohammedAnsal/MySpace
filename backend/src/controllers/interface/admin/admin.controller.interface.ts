import { Request, Response } from "express";

export interface IAdminController {
  fetchUsers(req: Request, res: Response): Promise<Response>;
  fetchProviders(req: Request, res: Response): Promise<Response>;
  updateUser(req: Request, res: Response): Promise<Response>;
  
  
}

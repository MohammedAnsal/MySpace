import { Request, Response } from "express";

export interface IUserController {
  logout(req: Request, res: Response): Promise<any>;
}

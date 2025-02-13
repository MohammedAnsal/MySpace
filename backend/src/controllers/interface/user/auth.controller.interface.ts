import { Request, Response } from "express";

export interface IAuthController {
  signUp(req: Request, res: Response): Promise<void>;
  signIn(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
}

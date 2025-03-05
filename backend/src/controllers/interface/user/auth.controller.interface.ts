import { Request, Response } from "express";

export interface IAuthController {
  signUp(req: Request, res: Response): Promise<any>;
  signIn(req: Request, res: Response): Promise<any>;
  verifyOtp(req: Request, res: Response): Promise<any>;
  resendOtp(req: Request, res: Response): Promise<any>;
  forgetPassword(req: Request, res: Response): Promise<any>;
  resetPassword(req: Request, res: Response): Promise<any>;
  setNewToken(req: Request, res: Response): Promise<any>;
  logout(req: Request, res: Response): Promise<any>;
}

import { Request, Response } from "express";

export interface IAuthController {
  signUp(req: Request, res: Response): Promise<Response>;
  signIn(req: Request, res: Response): Promise<Response>;
  verifyOtp(req: Request, res: Response): Promise<Response>;
  resendOtp(req: Request, res: Response): Promise<Response>;
  forgetPassword(req: Request, res: Response): Promise<Response>;
  resetPassword(req: Request, res: Response): Promise<Response>;
  setNewToken(req: Request, res: Response): Promise<Response>;
  googleSign(req: Request, res: Response): Promise<Response>;
  logout(req: Request, res: Response): Promise<Response>;
}

import { Request, Response } from "express";

export interface IAuthController {

    signUp(req: Request, res: Response):Promise<void>

}
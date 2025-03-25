import { Request } from "express";

export interface AuthRequset extends Request {
  user?: any;
}

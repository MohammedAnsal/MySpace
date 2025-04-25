import { Request } from "express";

// export interface AuthRequset extends Request {
//   user?: any;
// }

export interface AuthRequset extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

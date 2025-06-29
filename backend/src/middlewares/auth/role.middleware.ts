import { NextFunction, Response } from "express";
import { AuthRequset } from "../../types/api";
import { HttpStatus } from "../../enums/http.status";
import { AppError } from "../../utils/error";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return async (
    req: AuthRequset,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user;

      if (!user?.role) {
        throw new AppError("Role not exists", HttpStatus.FORBIDDEN);
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(HttpStatus.FORBIDDEN).json({
          message: "You do not have permission to perform this action",
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

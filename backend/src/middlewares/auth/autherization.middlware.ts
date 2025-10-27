import { NextFunction, Response } from "express";
import { AuthRequset } from "../../types/api";
import { User } from "../../models/user.model";
import { HttpStatus } from "../../enums/http.status";
import { Admin } from "../../models/admin/admin.model";

export const autherization = async (
  req: AuthRequset,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (req.user?.role == "admin") {
      const currentAdmin = await Admin.findById(userId);
      if (currentAdmin) next();
      else {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "Blocked by the Authority" });
      }
    } else {
      const currentUser = await User.findById(userId);
      if (currentUser?.is_active) next();
      else {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "Blocked by the Authority" });
      }
    }
  } catch (error) {
    console.log("Error in Autherization",error);
  }
};

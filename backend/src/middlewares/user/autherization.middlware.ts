import { NextFunction, Response } from "express";
import { AuthRequset } from "../../types/api";
import { User } from "../../models/user.model";
import { HttpStatus } from "../../enums/http.status";

export const Autherization = async (
  req: AuthRequset,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;

    const currentUser = await User.findById(userId);

    if (currentUser?.is_active) next();
    else {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Blocked by the Authority" });
    }
  } catch (error) {
    console.log("Error in Autherization");
  }
};

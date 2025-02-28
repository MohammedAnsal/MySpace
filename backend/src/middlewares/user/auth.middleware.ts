import { NextFunction, Response } from "express";
import { AuthRequset } from "../../types/api";
import { HttpStatus, responseMessage } from "../../enums/http.status";
import { verifyAccessToken } from "../../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";

export const AuthMiddleWare = async (
  req: AuthRequset,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"];

    console.log(token, "tatatta");

    if (!token) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Access denied . No token provided" });
    } else {
      const { id } = verifyAccessToken(token) as JwtPayload;
      const userId = id;

      if (userId) {
        req.user = userId;
        next();
      } else {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: responseMessage.ACCESS_DENIED });
      }
    }
  } catch (error) {
    console.log((error as Error).message);
    console.log("error from middleware");
    res.status(400).json({ message: (error as Error).message });
  }
};

import { NextFunction, Response } from "express";
import { AuthRequset } from "../../types/api";
import { verifyAccessToken } from "../../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";
import { HttpStatus, responseMessage } from "../../enums/http.status";

export const authMiddleWare = async (
  req: AuthRequset,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Access denied . No token provided" });
    else {
      const decodedToken = verifyAccessToken(token) as JwtPayload;
      const userId = decodedToken.id;
      const role = decodedToken.role;
      if (userId) {
        req.user = { id: userId, role: role };
        next();
      } else
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: responseMessage.ACCESS_DENIED });
    }
  } catch (error) {
    console.log((error as Error).message);
    console.log("error from middleware");
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: (error as Error).message });
  }
};

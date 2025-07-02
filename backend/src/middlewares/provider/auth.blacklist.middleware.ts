import { NextFunction, Response } from "express";
import redisClient from "../../config/redisConfig";
import { AuthRequset } from "../../types/api";
import { verifyRefreshToken } from "../../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";
import { HttpStatus } from "../../enums/http.status";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export const providerTokenBlackList = async (
  req: AuthRequset,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = req.cookies.provider_rfr;

  if (!refreshToken) {
    res.status(HttpStatus.FORBIDDEN).json({ message: "Unauthorized" });
    return;
  }

  try {
    const isBlacklisted = await redisClient.get(refreshToken);
    if (isBlacklisted) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Token has been blacklisted" });
    }

    const decoded = verifyRefreshToken(refreshToken) as CustomJwtPayload;
    if (!req.user) {
      req.user = { id: decoded.id.toString() };
    } else {
      req.user.id = decoded.id.toString();
      req.user.role = "user";
    }

    next();
  } catch (error) {
    res.status(HttpStatus.FORBIDDEN).json({ message: "Invalid token" });
  }
};

import { NextFunction, Response } from "express";
import redisClient from "../../config/redisConfig";
import { AuthRequset } from "../../types/api";
import { verifyRefreshToken } from "../../utils/jwt.utils";

export const userTokenBlackList = async (req: AuthRequset, res: Response, next: NextFunction): Promise<any> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(refreshToken);
    if (isBlacklisted) {
      return res.status(403).json({ message: "Token has been blacklisted" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    req.user = decoded;
    next(); // Move to the next middleware
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

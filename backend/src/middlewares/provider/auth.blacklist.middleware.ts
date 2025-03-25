import { NextFunction, Response } from "express";
import redisClient from "../../config/redisConfig";
import { AuthRequset } from "../../types/api";
import { verifyRefreshToken } from "../../utils/jwt.utils";

export const providerTokenBlackList = async (
  req: AuthRequset,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const refreshToken = req.cookies.provider_rfr;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const isBlacklisted = await redisClient.get(refreshToken);
    if (isBlacklisted) {
      return res.status(403).json({ message: "Token has been blacklisted" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    req.user = decoded;
    next(); 
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

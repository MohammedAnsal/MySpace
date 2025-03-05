import { NextFunction, Response } from "express";
import redisClient from "../../config/redisConfig";
import { AuthRequset } from "../../types/api";
import { verifyRefreshToken } from "../../utils/jwt.utils";


export const verifyRefreshTokenn = async (req : AuthRequset, res:Response, next:NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if token is blacklisted
  const isBlacklisted = await redisClient.get(refreshToken);
  if (isBlacklisted) {
    return res.status(403).json({ message: "Token has been blacklisted" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken)
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

import { NextFunction, Response } from "express";
import redisClient from "../../config/redisConfig";
import { AuthRequset } from "../../types/api";
import { verifyRefreshToken } from "../../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";
import { HttpStatus } from "../../enums/http.status";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export const userTokenBlackList = async (
  req: AuthRequset,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
     res.status(HttpStatus.FORBIDDEN).json({ message: "Unauthorized" });
  }

  try {
    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(refreshToken);
    if (isBlacklisted) {
       res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Token has been blacklisted" });
    }

    // Type cast the decoded token to our custom interface
    const decoded = verifyRefreshToken(refreshToken) as CustomJwtPayload;

    // Initialize the user object if it doesn't exist
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

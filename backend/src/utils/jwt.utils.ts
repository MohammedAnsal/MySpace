import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ||
  "5b31b8a136aea4e77156c90072185cc0bc2f31e784129b569f8b8dc2082ce8cd";
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  "39769aee2efe8ef7df54a4c4e4f0f5161e657fd0c8cffbae50afee9c6df53cc1";

/**
 * Generates an Access Token
 * @param payload - User data to encode
 * @returns Signed JWT token
 */

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "5h" });
};

/**
 * Generates a Refresh Token
 * @param payload - User data to encode
 * @returns Signed JWT token
 */
export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "1d" });
};

/**
 * Verifies the Access Token
 * @param token - JWT token to verify
 * @returns Decoded payload if valid, otherwise null
 */
export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verifies the Refresh Token
 * @param token - Refresh token to verify
 * @returns Decoded payload if valid, otherwise null
 */
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

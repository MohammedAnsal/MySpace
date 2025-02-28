import bcrypt from "bcryptjs";
import { HttpStatus } from "../enums/http.status";

export const hashPassword = async (pass: string): Promise<string> => {
  try {
    return await bcrypt.hash(pass, 10);
  } catch (error) {
    console.log(HttpStatus.BAD_REQUEST);
    throw new Error("Error hashing password");
  }
};

export const comparePassword = async (
  inpPass: string,
  actualPass: string
): Promise<boolean> => {
  return await bcrypt.compare(inpPass, actualPass);
};

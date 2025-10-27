import bcrypt from "bcryptjs";
import { HttpStatus } from "../enums/http.status";

export const hashPassword = async (pass: string): Promise<string> => {
  try {
    return await bcrypt.hash(pass, 10);
  } catch (error) {
    console.log(error);
    throw new Error("Error hashing password");
  }
};

export const RandomPassword = async () =>
  await bcrypt.hash(Math.random().toString(36).slice(-8), 10);

export const comparePassword = async (
  inpPass: string,
  actualPass: string
): Promise<boolean> => {
  return await bcrypt.compare(inpPass, actualPass);
};

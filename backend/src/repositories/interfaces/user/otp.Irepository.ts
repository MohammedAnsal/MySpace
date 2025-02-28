import { IOtp } from "../../../interface/otp.Imodel";

export interface IOtpRepository {
  createOtp(otpData: IOtp): Promise<IOtp>;
  findOtpByEmail(email: string): Promise<IOtp | null>;
  updateOtpByEmail(email: string, newOtp: string): Promise<void>;
  otpDeleteByEmail(email: string): Promise<void>;
}

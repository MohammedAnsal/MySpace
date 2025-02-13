import { IOtp } from "../../../interface/otp.Imodel";

export interface IOtpRepository {
  createOtp(otpData: IOtp): Promise<IOtp>;
  findOtpByEmail(email: string): Promise<IOtp | null>;
  otpDeleteByMail(email: string): Promise<void>;
}

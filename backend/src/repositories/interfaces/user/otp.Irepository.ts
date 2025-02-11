import { IOtp } from "../../../models/otp.model";

export interface IOtpRepository {
  createOtp(otpData: IOtp): Promise<IOtp>;
  findOtpByEmail(email: string): Promise<IOtp | null>;
}

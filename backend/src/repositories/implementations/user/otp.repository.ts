import { Service } from "typedi";
import { BaseRepository } from "../../base.repository";
import { IOtpRepository } from "../../interfaces/user/otp.Irepository";
import { Otp } from "../../../models/otp.model";
import { IOtp } from "../../../interface/otp.Imodel";

@Service()
export class OtpRepository
  extends BaseRepository<IOtp>
  implements IOtpRepository
{
  constructor() {
    super(Otp);
  }

  async createOtp(otpData: IOtp): Promise<IOtp> {
    try {
      return await this.create(otpData);
    } catch (error) {
      throw new Error(`Error creating OTP: ${(error as Error).message}`);
    }
  }

  async findOtpByEmail(email: string): Promise<IOtp | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw new Error(
        `Error finding OTP by email: ${(error as Error).message}`
      );
    }
  }

  async otpDeleteByMail(email: string): Promise<void> {
    try {
      await Otp.deleteOne({ email });
    } catch (error) {
      throw new Error(
        `Error deleting OTP by email: ${(error as Error).message}`
      );
    }
  }
}

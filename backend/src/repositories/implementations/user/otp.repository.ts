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

  //  For otp create :-

  async createOtp(otpData: IOtp): Promise<IOtp> {
    try {
      return await this.create(otpData);
    } catch (error) {
      throw new Error(`Error creating OTP: ${(error as Error).message}`);
    }
  }

  //  For find otp by email :-

  async findOtpByEmail(email: string): Promise<IOtp | null> {
    try {
      return await Otp.findOne({ email });
    } catch (error) {
      throw new Error(
        `Error finding OTP by email: ${(error as Error).message}`
      );
    }
  }

  //  For update otp :-

  async updateOtpByEmail(email: string, newOtp: string): Promise<void> {
    try {
      await Otp.updateOne(
        { email: email },
        { otp: newOtp, createdAt: new Date() }
      );
    } catch (error) {
      throw new Error(
        `Error updateing OTP by email: ${(error as Error).message}`
      );
    }
  }

  //  For delete otp :-

  async deleteOtpByEmail(email: string): Promise<void> {
    try {
      await Otp.deleteOne({ email });
    } catch (error) {
      throw new Error(
        `Error deleting OTP by email: ${(error as Error).message}`
      );
    }
  }
}

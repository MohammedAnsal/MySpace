import mongoose, { Schema } from "mongoose";
import { IOtp } from "../interface/otp.Imodel";

const otpSchema: Schema = new Schema<IOtp>(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "1m" },
  },
  { timestamps: true }
);

export const Otp = mongoose.model<IOtp>("Otp", otpSchema);

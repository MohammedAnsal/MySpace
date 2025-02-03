import mongoose, { Schema } from "mongoose";
import Iotp from "../interfaces/Iotp";

const otpSchema: Schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "2m" },
});

export const OtpSchema = mongoose.model<Iotp>("Otp", otpSchema);
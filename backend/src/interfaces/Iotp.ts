import { Document } from "mongoose";

export default interface Iotp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

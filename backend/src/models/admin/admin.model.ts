import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  fullName: string;
  email: string;
  password: string;
}

export const adminSchema = new Schema<IAdmin>(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin = mongoose.model<IAdmin>("admin", adminSchema);

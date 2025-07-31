import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
  role?: string;
}

export const adminSchema = new Schema<IAdmin>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin = mongoose.model<IAdmin>("admin", adminSchema);
 
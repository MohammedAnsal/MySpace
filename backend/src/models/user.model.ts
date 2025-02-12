import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: number;
  password: string;
  profile_picture: string;
  gender: "Male" | "Female" | "Other";
  address_id: mongoose.Types.ObjectId;
  role: "user" | "provider";
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    profile_picture: { type: String, default: "" },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    role: {
      type: String,
      enum: ["user", "provider"],
      default: "user",
    },
    is_verified: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },
    created_at: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);

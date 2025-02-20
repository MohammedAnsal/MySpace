import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  profile_picture: string;
  gender: "male" | "female" | "other";
  address_id?: mongoose.Types.ObjectId | null;
  role: "user" | "provider";
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true },
    profile_picture: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other"] },
    address_id: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      default: null,
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

import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  updated_at: Date;
  is_blocked: boolean;
  _id: string;
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
  google_id: string;
  created_at: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true },
    profile_picture: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    },
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
    is_active: { type: Boolean, default: true },
    google_id: { type: String },
    created_at: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);

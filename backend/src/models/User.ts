import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  fullName: string;
  email: string;
  phone: number;
  password: string;
  profile_picture: string;
  address_id: mongoose.Types.ObjectId;
  is_block: boolean;
  role: "user" | "provider";
}

const userSchema = new Schema<UserDocument>({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  profile_picture: { type: String, required: true },
  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  role: { type: String, enum: ["user", "provider"], required: true },
  is_block: { type: Boolean, default: false },
});

export const UserSchema = mongoose.model<UserDocument>("User", userSchema);

import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IHostel extends Document {
  hostel_name: string | null;
  monthly_rent: number | null;
  deposit_amount: number | null;
  deposit_terms: string[] | null;
  maximum_occupancy: number | null;
  rules: string | null;
  gender: string | null;
  available_space: number | null;
  total_space: number | null;
  status: boolean | null;
  photos: string[] | null;
  amenities: string[] | null;
  description: string | null;
  location: ObjectId | null;
  provider_id: ObjectId | null;
  facilities: ObjectId[] | null;
  reason: string;
  is_verified: boolean;
  is_rejected: boolean;
  created_at: Date;
  updated_at: Date;
}

const HostelSchema: Schema = new Schema<IHostel>(
  {
    hostel_name: { type: String },
    monthly_rent: { type: Number },
    deposit_amount: { type: Number },
    deposit_terms: [{ type: String }],
    maximum_occupancy: { type: Number },
    rules: { type: String },
    gender: { type: String, required: true },
    available_space: { type: Number },
    total_space: { type: Number },
    status: { type: Boolean, default: true },
    photos: [{ type: String }],
    amenities: [{ type: String }],
    description: { type: String },
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    provider_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    facilities: [{ type: Schema.Types.ObjectId, ref: "Facility" }],
    reason: { type: String, default: "" },
    is_verified: { type: Boolean, default: false },
    is_rejected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Hostel = mongoose.model<IHostel>("Hostel", HostelSchema);

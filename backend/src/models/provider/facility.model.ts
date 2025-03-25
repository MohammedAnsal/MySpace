import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IFacility extends Document {
  name: string;
  provider_id?: ObjectId;
  price: number;
  status?: boolean;
  description?: string;
}

const FacilitySchema: Schema = new Schema({
  name: { type: String, required: true },
  provider_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  description: { type: String },
});

export const Facility = mongoose.model<IFacility>("Facility", FacilitySchema);

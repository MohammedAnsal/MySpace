import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IAdminFacility extends Document {
  name: string;
  price: number;
  status?: boolean;
  description?: string;
}

const AdminFacilitySchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  description: { type: String },
});

export const AdminFacility = mongoose.model<IAdminFacility>("Facility", AdminFacilitySchema); 
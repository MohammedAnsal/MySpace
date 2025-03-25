import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ILocation extends Document {
  _id: ObjectId;
  latitude: number;
  longitude: number;
  address: string;
}

const locationSchema = new Schema<ILocation>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

export const Location = mongoose.model<ILocation>("Location", locationSchema);

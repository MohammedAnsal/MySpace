import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ILocation extends Document {
  updated_at: Date;
  created_at: Date;
  _id: ObjectId;
  latitude: number;
  longitude: number;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

const locationSchema = new Schema<ILocation>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  { timestamps: true }
);

// Add 2dsphere index
locationSchema.index({ location: "2dsphere" });

export const Location = mongoose.model<ILocation>("Location", locationSchema);

// import mongoose, { Document, ObjectId, Schema } from "mongoose";

// export interface ILocation extends Document {
//   _id: ObjectId;
//   latitude: number;
//   longitude: number;
//   address: string;
// }

// const locationSchema = new Schema<ILocation>(
//   {
//     latitude: { type: Number, required: true },
//     longitude: { type: Number, required: true },
//     address: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export const Location = mongoose.model<ILocation>("Location", locationSchema);

import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ILocation extends Document {
  _id: ObjectId;
  latitude: number;
  longitude: number;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const locationSchema = new Schema<ILocation>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },

    // GeoJSON location field for geospatial queries
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        // Don't make this required since we'll set it programmatically
      },
    },
  },
  { timestamps: true }
);

// Add 2dsphere index
locationSchema.index({ location: "2dsphere" });

export const Location = mongoose.model<ILocation>("Location", locationSchema);

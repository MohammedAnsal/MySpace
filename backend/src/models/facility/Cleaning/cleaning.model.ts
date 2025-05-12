import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICleaning extends Document {
  userId: Types.ObjectId;
  providerId: Types.ObjectId;
  hostelId: Types.ObjectId;
  facilityId: Types.ObjectId;
  requestedDate: Date;
  preferredTimeSlot: "Morning" | "Afternoon" | "Evening" | "Night";
  specialInstructions?: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  feedback?: {
    rating: number;
    comment?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CleaningSchema: Schema = new Schema<ICleaning>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    providerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    hostelId: { type: Schema.Types.ObjectId, required: true, ref: "Hostel" },
    facilityId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Facility",
    },
    requestedDate: { type: Date, required: true },
    preferredTimeSlot: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening", "Night"],
      required: true,
    },
    specialInstructions: { type: String },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICleaning>("Cleaning", CleaningSchema);

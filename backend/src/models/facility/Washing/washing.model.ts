import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWashing extends Document {
  userId: Types.ObjectId;
  providerId: Types.ObjectId;
  hostelId: Types.ObjectId;
  facilityId: Types.ObjectId;
  requestedDate: Date;
  preferredTimeSlot: "Morning" | "Afternoon" | "Evening" | "Night";

  itemsCount: number;
  specialInstructions?: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  feedback?: {
    rating: number;
    comment?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WashingSchema: Schema = new Schema<IWashing>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    hostelId: { type: Schema.Types.ObjectId, required: true, ref: "Hostel" },
    facilityId: { type: Schema.Types.ObjectId, required: true, ref: "Facility" },
    requestedDate: { type: Date, required: true },
    itemsCount: { type: Number, required: true },
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

export default mongoose.model<IWashing>("Washing", WashingSchema);

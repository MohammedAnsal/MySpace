import { Schema, model, Document , Types } from "mongoose";

export interface IRating extends Document {
  user_id: Types.ObjectId;
  hostel_id: Types.ObjectId;
  booking_id: Types.ObjectId;
  rating: number;
  comment?: string;
  created_at: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hostel_id: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
    booking_id: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const Rating = model<IRating>("Rating", ratingSchema);

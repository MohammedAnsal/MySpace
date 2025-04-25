import { Schema, model, Document, ObjectId } from "mongoose";

export interface IRating extends Document {
  user_id: ObjectId;
  hostel_id: ObjectId;
  rating: number;
  comment?: string;
  created_at: Date;
}

const ratingSchema = new Schema<IRating>( 
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hostel_id: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const Rating = model<IRating>("Rating", ratingSchema);

import { Schema, model, Document } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  description: string;
  image: string;
  category: "Breakfast" | "Lunch" | "Dinner";
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = model<IMenuItem>("MenuItem", MenuItemSchema);
export default MenuItem;

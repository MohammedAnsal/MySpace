import { Schema, model, Document, Types } from "mongoose";

export interface IDayMeal {
  day: string;
  meals: {
    morning: {
      items: Types.ObjectId[];
      isAvailable: boolean;
    };
    noon: {
      items: Types.ObjectId[];
      isAvailable: boolean;
    };
    night: {
      items: Types.ObjectId[];
      isAvailable: boolean;
    };
  };
}

export interface IFoodMenu extends Document {
  facilityId: Types.ObjectId;
  providerId: Types.ObjectId;
  hostelId: Types.ObjectId;
  menu: IDayMeal[];
  createdAt: Date;
  updatedAt: Date;
}

const DayMealSchema = new Schema<IDayMeal>(
  {
    day: {
      type: String,
      required: true,
    },
    meals: {
      morning: {
        items: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
        isAvailable: { type: Boolean, default: true }
      },
      noon: {
        items: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
        isAvailable: { type: Boolean, default: true }
      },
      night: {
        items: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
        isAvailable: { type: Boolean, default: true }
      }
    },
  },
  { _id: false }
);

const FoodMenuSchema = new Schema<IFoodMenu>(
  {
    facilityId: {
      type: Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hostelId: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    menu: [DayMealSchema],
  },
  {
    timestamps: true,
  }
);

const FoodMenu = model<IFoodMenu>("FoodMenu", FoodMenuSchema);
export default FoodMenu;

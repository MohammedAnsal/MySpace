import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IFacilitySelection {
  type: "Food" | "Washing" | "Cleaning";
  startDate: Date;
  endDate: Date;
  ratePerDay: number;
  totalCost: number;
}

export interface IBooking extends Document {
  userId: ObjectId;
  hostelId: ObjectId;
  providerId: ObjectId;

  checkIn: Date;
  checkOut: Date;
  stayDurationInMonths: number;

  // selectedSpace: string;
  selectedFacilities: IFacilitySelection[];

  bookingDate: Date;
  totalPrice: number;
  depositAmount: number;
  monthlyRent: number;
  paymentStatus: "pending" | "paid" | "cancelled";

  proof: string;

  createdAt: Date;
  updatedAt: Date;
}

const FacilitySelectionSchema: Schema = new Schema({
  facilityId: { type: Schema.Types.ObjectId, ref: "Facility" },
  type: {
    type: String,
    enum: ["Food", "Washing", "Cleaning"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  ratePerDay: { type: Number, required: true },
  totalCost: { type: Number, required: true },
});

const BookingSchema: Schema<IBooking> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hostelId: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    stayDurationInMonths: { type: Number, required: true },

    // selectedSpace: { type: String },
    selectedFacilities: [FacilitySelectionSchema],

    bookingDate: { type: Date, default: Date.now },
    totalPrice: { type: Number, required: true },
    depositAmount: { type: Number, required: true },
    monthlyRent: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },

    proof: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;

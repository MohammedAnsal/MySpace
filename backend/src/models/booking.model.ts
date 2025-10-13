import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IFacilitySelection {
  facilityId: mongoose.Types.ObjectId;
  type: "Catering Service" | "Laundry Service" | "Deep Cleaning Service";
  startDate: Date;
  endDate: Date;
  duration: number;
  ratePerMonth: number;
  totalCost: number;
}

export interface IMonthlyPayment {
  month: number;
  dueDate: Date;
  paid: boolean;
  status: "pending" | "completed";
  paidAt: Date | null;
  reminderSent: boolean;
}

export interface IBooking extends Document {
  userId: ObjectId;
  hostelId: ObjectId;
  providerId: ObjectId;

  checkIn: Date;
  checkOut: Date;
  stayDurationInMonths: number;
  selectedFacilities: IFacilitySelection[];

  monthlyPayments: IMonthlyPayment[];

  bookingDate: Date;
  totalPrice: number;
  firstMonthRent: number;
  depositAmount: number;
  monthlyRent: number;
  paymentStatus: "pending" | "completed" | "cancelled" | "expired";

  proof: string;
  reason: string;
  paymentExpiry: Date;
  stayDurationReminderSent: Date;
  monthlyRentReminderSent: Date;

  createdAt: Date;
  updatedAt: Date;
}

const FacilitySelectionSchema: Schema<IFacilitySelection> = new Schema({
  facilityId: { type: Schema.Types.ObjectId, ref: "Facility" },
  type: {
    type: String,
    enum: ["Catering Service", "Laundry Service", "Deep Cleaning Service"],
  },
  startDate: { type: Date },
  endDate: { type: Date },
  duration: { type: Number },
  ratePerMonth: { type: Number },
  totalCost: { type: Number },
});

const MonthlyPaymentSchema: Schema<IMonthlyPayment> = new Schema({
  month: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paid: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  paidAt: { type: Date, default: null },
  reminderSent: { type: Boolean, default: false },
});

const BookingSchema: Schema<IBooking> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hostelId: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    stayDurationInMonths: { type: Number, required: true },

    reason: { type: String, default: "" },
    selectedFacilities: [FacilitySelectionSchema],

    monthlyPayments: [MonthlyPaymentSchema],

    bookingDate: { type: Date, default: Date.now },
    totalPrice: { type: Number, required: true },
    firstMonthRent: { type: Number, required: true },
    depositAmount: { type: Number, required: true },
    monthlyRent: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "expired"],
      default: "pending",
    },

    proof: {
      type: String,
      required: true,
    },
    paymentExpiry: {
      type: Date,
      required: true,
    },

    stayDurationReminderSent: {
      type: Date,
      default: null,
    },
    monthlyRentReminderSent: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;

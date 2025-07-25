import { IBooking, IFacilitySelection } from "../../../models/booking.model";
import mongoose from "mongoose";

export interface CreateBookingData {
  userId: mongoose.Types.ObjectId;
  hostelId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  stayDurationInMonths: number;
  selectedFacilities: IFacilitySelection[];
  totalPrice: number;
  firstMonthRent: number;
  depositAmount: number;
  monthlyRent: number;
  proof: string;
}

export interface UpdateBookingData {
  checkIn?: Date;
  checkOut?: Date;
  stayDurationInMonths?: number;
  selectedFacilities?: IFacilitySelection[];
  totalPrice?: number;
  paymentStatus?: "pending" | "paid" | "cancelled";
  proof?: string;
}

export interface IBookingRepository {
  createBooking(bookingData: CreateBookingData): Promise<IBooking>;
  createBookingWithSession(bookingData: CreateBookingData, session: mongoose.ClientSession): Promise<IBooking>;
  getBookingById(bookingId: string): Promise<IBooking | null>;
  getBookingByIdUnPopulated(bookingId: string): Promise<IBooking | null>;
  getUserBookings(userId: string): Promise<IBooking[]>;
  getAllBookings(): Promise<IBooking[]>;
  getProviderBookings(providerId: string): Promise<IBooking[]>;
  cancelBooking(bookingId: string, reason: string): Promise<IBooking | null>;
  updatePaymentStatus(
    bookingId: string,
    status: "pending" | "completed" | "cancelled"
  ): Promise<IBooking | null>;
  addFacilitiesToBooking(
    bookingId: string,
    facilities: any[]
  ): Promise<IBooking | null>;
}

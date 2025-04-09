import { IBooking, IFacilitySelection } from "../../../models/booking.model";
import { ObjectId } from "mongoose";

export interface CreateBookingData {
  userId: ObjectId;
  hostelId: ObjectId;
  providerId: ObjectId;
  checkIn: Date;
  checkOut: Date;
  stayDurationInMonths: number;
  selectedFacilities: IFacilitySelection[];
  totalPrice: number;
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
  
  // getBookingById(bookingId: string): Promise<IBooking | null>;
  
  // getUserBookings(userId: string): Promise<IBooking[]>;
  
  // getHostelBookings(hostelId: string): Promise<IBooking[]>;
  
  // getProviderBookings(providerId: string): Promise<IBooking[]>;
  
  // updateBooking(bookingId: string, updateData: UpdateBookingData): Promise<IBooking | null>;
  
  // cancelBooking(bookingId: string): Promise<IBooking | null>;
  
  updatePaymentStatus(bookingId: string, status: "pending" | "paid" | "cancelled"): Promise<IBooking | null>;
  
  // getActiveBookings(hostelId: string): Promise<IBooking[]>;
  
  // getBookingsByDateRange(
  //   hostelId: string,
  //   startDate: Date,
  //   endDate: Date
  // ): Promise<IBooking[]>;
  
  checkBookingAvailability(
    hostelId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean>;
}

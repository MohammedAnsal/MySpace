import {
  IBookingRepository,
  CreateBookingData,
} from "../../interfaces/user/booking.Irepository";
import Booking, { IBooking } from "../../../models/booking.model";
import mongoose from "mongoose";
import Container, { Service } from "typedi";
@Service()
export class BookingRepository implements IBookingRepository {
  //  For create booking :-

  async createBooking(bookingData: CreateBookingData): Promise<IBooking> {
    try {
      const booking = await Booking.create(bookingData);

      const populatedBooking = await booking.populate([
        { path: "userId", model: "User" },
        { path: "hostelId", model: "Hostel" },
        { path: "selectedFacilities.facilityId", model: "Facility" },
      ]);

      return populatedBooking;
    } catch (error) {
      console.error("Error in repository createBooking:", error);
      throw error;
    }
  }

  // Create booking with session
  async createBookingWithSession(
    bookingData: CreateBookingData,
    session: mongoose.ClientSession
  ): Promise<IBooking> {
    try {
      const booking = await Booking.create([bookingData], { session });

      const populatedBooking = await booking[0].populate([
        { path: "userId", model: "User" },
        { path: "hostelId", model: "Hostel" },
        { path: "selectedFacilities.facilityId", model: "Facility" },
      ]);

      return populatedBooking;
    } catch (error) {
      console.error("Error in repository createBooking:", error);
      throw error;
    }
  }

  //  For get single booking :-

  async getBookingById(bookingId: string): Promise<IBooking | null> {
    return await Booking.findById(bookingId)
      .populate("userId", "fullName email phone")
      .populate({
        path: "hostelId",
        select: "hostel_name location facilities", // <-- use facilities
        populate: [
          {
            path: "facilities", // <-- use facilities
            select: "name price description",
          },
          {
            path: "location",
            select: "latitude longitude address",
          },
        ],
      })
      .populate("providerId", "fullName email phone");
  }

  //  For get single booking :- (Un populated)

  async getBookingByIdUnPopulated(bookingId: string): Promise<IBooking | null> {
    return await Booking.findById(bookingId);
  }

  //  For get all booking's :-

  async getAllBookings(): Promise<IBooking[]> {
    return await Booking.find()
      .populate("userId", "fullName email phone")
      .populate({
        path: "hostelId",
        select: "hostel_name location",
        populate: {
          path: "location",
          select: "latitude longitude address",
        },
      })
      .populate("providerId", "fullName email phone");
  }

  //  For get user booking's :-

  async getUserBookings(userId: string): Promise<IBooking[]> {
    return await Booking.find({
      userId: new mongoose.Types.ObjectId(userId),
      paymentStatus: { $ne: "expired" },
    })
      .populate({
        path: "hostelId",
        select: "hostel_name location", // Include location field
        populate: {
          path: "location", // Then populate this field
          select: "latitude longitude address", // Select needed fields from the location document
        },
      })
      .sort({ createdAt: -1 });
  }

  //  For get provider booking's :-

  async getProviderBookings(providerId: string): Promise<IBooking[]> {
    return await Booking.find({
      providerId: new mongoose.Types.ObjectId(providerId),
    })
      .populate({
        path: "hostelId",
        select: "hostel_name location",
        populate: {
          path: "location",
          select: "address",
        },
      })
      .populate("userId", "fullName email phone")
      .sort({ createdAt: -1 });
  }

  // For cancle booking :-

  async cancelBooking(
    bookingId: string,
    reason: string
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          paymentStatus: "cancelled",
          reason: reason,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
  }

  //  For update booking payment status :-

  async updatePaymentStatus(
    bookingId: string,
    status: "pending" | "completed" | "cancelled"
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          paymentStatus: status,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
  }

  async addFacilitiesToBooking(
    bookingId: string,
    facilities: any[]
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(
      bookingId,
      { $push: { selectedFacilities: { $each: facilities } } },
      { new: true }
    )
      .populate("userId", "fullName email phone")
      .populate("hostelId", "hostel_name location")
      .populate("providerId", "fullName email phone")
      .populate("selectedFacilities.facilityId", "name description");
  }
}

export const bookingRepository = Container.get(BookingRepository);

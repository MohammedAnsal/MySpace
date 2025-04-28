import {
  IBookingRepository,
  CreateBookingData,
  UpdateBookingData,
} from "../../interfaces/user/booking.Irepository";
import Booking, { IBooking } from "../../../models/booking.model";
import mongoose from "mongoose";
import Container, { Service } from "typedi";
@Service()
export class BookingRepository implements IBookingRepository {
  async createBooking(bookingData: CreateBookingData): Promise<IBooking> {
    try {
      const booking = await Booking.create(bookingData);

      // Use the correct field names for population
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

  async getBookingById(bookingId: string): Promise<IBooking | null> {
    return await Booking.findById(bookingId)
      .populate("userId", "fullName email phone")
      .populate("hostelId", "hostel_name location")
      .populate("providerId", "fullName email phone");
  }

  async getAllBookings(): Promise<IBooking[]> {
    return await Booking.find()
      .populate("userId", "fullName email phone")
      .populate({
        path: "hostelId",
        select: "hostel_name location", // Include location field
        populate: {
          path: "location", // Then populate this field
          select: "address", // Select needed fields from the location document
        },
      })
      .populate("providerId", "fullName email phone");
  }

  async getUserBookings(userId: string): Promise<IBooking[]> {
    return await Booking.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate({
        path: "hostelId",
        select: "hostel_name location", // Include location field
        populate: {
          path: "location", // Then populate this field
          select: "address", // Select needed fields from the location document
        },
      })
      .sort({ createdAt: -1 });
  }

  // async getHostelBookings(hostelId: string): Promise<IBooking[]> {
  //   return await Booking.find({
  //     hostelId: new mongoose.Types.ObjectId(hostelId),
  //   })
  //     .populate("userId", "name email")
  //     .sort({ checkIn: -1 });
  // }

  async getProviderBookings(providerId: string): Promise<IBooking[]> {
    return await Booking.find({
      providerId: new mongoose.Types.ObjectId(providerId),
    })
      .populate({
        path: "hostelId",
        select: "hostel_name location", // Include location field
        populate: {
          path: "location", // Then populate this field
          select: "address", // Select needed fields from the location document
        },
      })
      .populate("userId", "fullName email phone")
      .sort({ createdAt: -1 });
  }

  // async updateBooking(
  //   bookingId: string,
  //   updateData: UpdateBookingData
  // ): Promise<IBooking | null> {
  //   return await Booking.findByIdAndUpdate(
  //     bookingId,
  //     { $set: updateData },
  //     { new: true }
  //   );
  // }

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

  // async getActiveBookings(hostelId: string): Promise<IBooking[]> {
  //   const currentDate = new Date();
  //   return await Booking.find({
  //     hostelId: new mongoose.Types.ObjectId(hostelId),
  //     checkOut: { $gte: currentDate },
  //     paymentStatus: "paid",
  //   }).sort({ checkIn: 1 });
  // }

  // async getBookingsByDateRange(
  //   hostelId: string,
  //   startDate: Date,
  //   endDate: Date
  // ): Promise<IBooking[]> {
  //   return await Booking.find({
  //     hostelId: new mongoose.Types.ObjectId(hostelId),
  //     $or: [
  //       {
  //         checkIn: { $gte: startDate, $lte: endDate },
  //       },
  //       {
  //         checkOut: { $gte: startDate, $lte: endDate },
  //       },
  //       {
  //         $and: [
  //           { checkIn: { $lte: startDate } },
  //           { checkOut: { $gte: endDate } },
  //         ],
  //       },
  //     ],
  //   });
  // }

  async checkBookingAvailability(
    hostelId: string,
    checkIn: Date,
    checkOut: Date
  ): Promise<boolean> {
    const conflictingBookings = await Booking.find({
      hostelId: new mongoose.Types.ObjectId(hostelId),
      paymentStatus: { $ne: "cancelled" },
      $or: [
        {
          checkIn: { $lte: checkOut },
          checkOut: { $gte: checkIn },
        },
      ],
    });

    return conflictingBookings.length === 0;
  }
}

export const bookingRepository = Container.get(BookingRepository);

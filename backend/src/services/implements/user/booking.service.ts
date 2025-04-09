import {
  IBookingService,
  BookingCreateDTO,
  BookingUpdateDTO,
} from "../../interface/user/booking.service.interface";
import { IBookingRepository } from "../../../repositories/interfaces/user/booking.Irepository";
import { IHostelRepository } from "../../../repositories/interfaces/user/hostel.Irepository";
import { IBooking, IFacilitySelection } from "../../../models/booking.model";
import { AppError } from "../../../utils/error";
import mongoose from "mongoose";
import { s3Service } from "../s3/s3.service";

export class BookingService implements IBookingService {
  private s3Service: s3Service;

  constructor(
    s3Service: s3Service,
    private bookingRepository: IBookingRepository,
    private hostelRepository: IHostelRepository
  ) {
    this.s3Service = s3Service;
  }

  async createBooking(bookingData: BookingCreateDTO): Promise<IBooking> {
    try {
      // Check if hostel exists
      const hostel = await this.hostelRepository.getHostelById(
        bookingData.hostelId
      );
      if (!hostel) {
        throw new AppError("Hostel not found", 404);
      }

      // Check availability
      const isAvailable = await this.checkAvailability(
        bookingData.hostelId,
        bookingData.checkIn,
        bookingData.checkOut,
      );

      if (!isAvailable) {
        throw new AppError(
          "Selected space is not available for the given dates",
          400
        );
      }

      // Validate proof file
      if (!bookingData.proof || !bookingData.proof.buffer) {
        throw new AppError("Proof document is required", 400);
      }

      // Upload proof to S3
      const uploadResult = await this.s3Service.uploadFile(
        bookingData.proof,
        "proof"
      );

      if (
        !uploadResult ||
        (Array.isArray(uploadResult)
          ? !uploadResult[0].Location
          : !uploadResult.Location)
      ) {
        throw new AppError("Failed to upload proof document", 500);
      }

      // Calculate costs
      const costs = await this.calculateBookingCost(
        bookingData.hostelId,
        bookingData.stayDurationInMonths,
        bookingData.selectedFacilities
      );

      // Create booking with S3 URL
      const booking = await this.bookingRepository.createBooking({
        ...bookingData,
        userId: new mongoose.Types.ObjectId(
          bookingData.userId
        ) as unknown as mongoose.Schema.Types.ObjectId,
        hostelId: new mongoose.Types.ObjectId(
          bookingData.hostelId
        ) as unknown as mongoose.Schema.Types.ObjectId,
        providerId: new mongoose.Types.ObjectId(
          bookingData.providerId
        ) as unknown as mongoose.Schema.Types.ObjectId,
        proof: Array.isArray(uploadResult)
          ? uploadResult[0].Location
          : uploadResult.Location, // Store the S3 URL
        ...costs,
      });

      return booking;
    } catch (error) {
      // If anything fails after uploading to S3, try to clean up the uploaded file
      if (error instanceof AppError && bookingData.proof) {
        try {
          // Delete the uploaded file if it exists
          await this.s3Service.delete_File([String(bookingData.proof)]);
        } catch (deleteError) {
          console.error(
            "Failed to delete S3 file after booking error:",
            deleteError
          );
        }
      }
      throw error;
    }
  }

  // async getBookingDetails(bookingId: string): Promise<IBooking> {
  //   const booking = await this.bookingRepository.getBookingById(bookingId);
  //   if (!booking) {
  //     throw new AppError("Booking not found", 404);
  //   }

  //   // Generate signed URL for proof if it exists
  //   if (booking.proof) {
  //     const signedUrl = await this.s3Service.generateSignedUrl(booking.proof);
  //     return {
  //       ...booking.toObject(),
  //       proof: signedUrl,
  //     };
  //   }

  //   return booking;
  // }

  // async getUserBookings(userId: string): Promise<IBooking[]> {
  //   return await this.bookingRepository.getUserBookings(userId);
  // }

  // async getHostelBookings(hostelId: string): Promise<IBooking[]> {
  //   return await this.bookingRepository.getHostelBookings(hostelId);
  // }

  // async updateBooking(
  //   bookingId: string,
  //   updateData: BookingUpdateDTO
  // ): Promise<IBooking> {
  //   const booking = await this.bookingRepository.getBookingById(bookingId);
  //   if (!booking) {
  //     throw new AppError("Booking not found", 404);
  //   }

  //   if (booking.paymentStatus === "cancelled") {
  //     throw new AppError("Cannot update cancelled booking", 400);
  //   }

  //   // Handle proof update if new proof is provided
  //   let proofUrl = booking.proof;
  //   if (updateData.proof) {
  //     try {
  //       // Delete old proof if it exists
  //       if (booking.proof) {
  //         await this.s3Service.delete_File([booking.proof]);
  //       }

  //       // Upload new proof
  //       const uploadResult = await this.s3Service.uploadFile(
  //         updateData.proof,
  //         `bookings/${booking.userId}/proofs`
  //       );

  //       if (Array.isArray(uploadResult)) {
  //         if (!uploadResult[0]?.Location) {
  //           throw new AppError("Failed to upload new proof document", 500);
  //         }
  //         proofUrl = uploadResult[0].Location;
  //       } else {
  //         if (!uploadResult.Location) {
  //           throw new AppError("Failed to upload new proof document", 500);
  //         }
  //         proofUrl = uploadResult.Location;
  //       }
  //     } catch (error) {
  //       throw new AppError("Failed to update proof document", 500);
  //     }
  //   }

  //   // Recalculate costs if necessary
  //   let costs = {};
  //   if (updateData.stayDurationInMonths || updateData.selectedFacilities) {
  //     costs = await this.calculateBookingCost(
  //       booking.hostelId.toString(),
  //       updateData.stayDurationInMonths || booking.stayDurationInMonths,
  //       updateData.selectedFacilities || booking.selectedFacilities
  //     );
  //   }

  //   const updatedBooking = await this.bookingRepository.updateBooking(
  //     bookingId,
  //     {
  //       ...updateData,
  //       proof: proofUrl,
  //       ...costs,
  //     }
  //   );

  //   if (!updatedBooking) {
  //     throw new AppError("Failed to update booking", 500);
  //   }

  //   return updatedBooking;
  // }

  // async cancelBooking(bookingId: string): Promise<IBooking> {
  //   const booking = await this.bookingRepository.getBookingById(bookingId);
  //   if (!booking) {
  //     throw new AppError("Booking not found", 404);
  //   }

  //   if (booking.paymentStatus === "cancelled") {
  //     throw new AppError("Booking is already cancelled", 400);
  //   }

  //   const cancelledBooking = await this.bookingRepository.cancelBooking(
  //     bookingId
  //   );
  //   if (!cancelledBooking) {
  //     throw new AppError("Failed to cancel booking", 500);
  //   }

  //   return cancelledBooking;
  // }

  // async processPayment(
  //   bookingId: string,
  //   paymentDetails: any
  // ): Promise<IBooking> {
  //   const booking = await this.bookingRepository.getBookingById(bookingId);
  //   if (!booking) {
  //     throw new AppError("Booking not found", 404);
  //   }

  //   if (booking.paymentStatus === "paid") {
  //     throw new AppError("Booking is already paid", 400);
  //   }

  //   if (booking.paymentStatus === "cancelled") {
  //     throw new AppError("Cannot process payment for cancelled booking", 400);
  //   }

  //   // Process payment logic here
  //   // ... payment gateway integration

  //   const updatedBooking = await this.bookingRepository.updatePaymentStatus(
  //     bookingId,
  //     "paid"
  //   );
  //   if (!updatedBooking) {
  //     throw new AppError("Failed to update payment status", 500);
  //   }

  //   return updatedBooking;
  // }

  async checkAvailability(
    hostelId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    return await this.bookingRepository.checkBookingAvailability(
      hostelId,
      checkIn,
      checkOut,
    );
  }

  async calculateBookingCost(
    hostelId: string,
    stayDurationInMonths: number,
    selectedFacilities: IFacilitySelection[]
  ): Promise<{
    totalPrice: number;
    depositAmount: number;
    monthlyRent: number;
    facilityCharges: number;
  }> {
    const hostel = await this.hostelRepository.getHostelById(hostelId);
    if (!hostel) {
      throw new AppError("Hostel not found", 404);
    }

    const monthlyRent = hostel.monthly_rent;
    const depositAmount = hostel.deposit_amount;

    // Calculate facility charges
    const facilityCharges = selectedFacilities.reduce((total, facility) => {
      const durationInDays = Math.floor(
        (facility.endDate.getTime() - facility.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return total + facility.ratePerDay * durationInDays;
    }, 0);

    if (!monthlyRent || !depositAmount) {
      throw new AppError("Invalid hostel pricing data", 400);
    }

    const totalPrice =
      monthlyRent * stayDurationInMonths + depositAmount + facilityCharges;

    return {
      totalPrice,
      depositAmount,
      monthlyRent,
      facilityCharges,
    };
  }
}

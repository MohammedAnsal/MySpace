import {
  IBookingService,
  BookingCreateDTO,
  BookingUpdateDTO,
  FacilityI,
} from "../../interface/user/booking.service.interface";
import { IBookingRepository } from "../../../repositories/interfaces/user/booking.Irepository";
import { IHostelRepository } from "../../../repositories/interfaces/user/hostel.Irepository";
import { IBooking, IFacilitySelection } from "../../../models/booking.model";
import { AppError } from "../../../utils/error";
import mongoose, { Types, Schema } from "mongoose";
import { s3Service } from "../s3/s3.service";
import Container, { Service } from "typedi";
import { hostelRepository } from "../../../repositories/implementations/user/hostel.repository";
import { adminFacilityRepository } from "../../../repositories/implementations/admin/facility.repository";
import { IFacilityRepository } from "../../../repositories/interfaces/provider/facility.Irepository";
import { bookingRepository } from "../../../repositories/implementations/user/booking.repository";

@Service()
export class BookingService implements IBookingService {
  private s3Service: s3Service;
  private hostelRepository: IHostelRepository;
  private facilityRepository: IFacilityRepository;
  private bookingRepository: IBookingRepository;

  constructor(s3Service: s3Service) {
    this.s3Service = s3Service;
    this.hostelRepository = hostelRepository;
    this.facilityRepository = adminFacilityRepository;
    this.bookingRepository = bookingRepository;
  }

  async createBooking(
    bookingData: BookingCreateDTO,
    selectedFacilitiess: FacilityI[]
  ): Promise<IBooking> {
    try {
      // Check if hostel exists
      const hostel = await this.hostelRepository.getHostelById(
        bookingData.hostelId
      );
      if (!hostel) {
        throw new AppError("Hostel not found", 404);
      }

      console.log(selectedFacilitiess);

      // // Check availability
      // const isAvailable = await this.checkAvailability(
      //   bookingData.hostelId,
      //   bookingData.checkIn,
      //   bookingData.checkOut
      // );

      // if (!isAvailable) {
      //   throw new AppError(
      //     "Selected space is not available for the given dates",
      //     400
      //   );
      // }

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

      // Calculate costs and get transformed facilities
      const { totalPrice, depositAmount, monthlyRent, transformedFacilities , firstMonthRent } =
        await this.calculateBookingCost(
          bookingData.hostelId,
          bookingData.stayDurationInMonths,
          selectedFacilitiess.map((facility) => ({
            id: facility.id.toString(), // Convert ObjectId to string
            duration: String(facility.duration),
          }))
        );

      // Create booking with S3 URL and transformed facilities
      const booking = await this.bookingRepository.createBooking({
        ...bookingData,
        userId: new Types.ObjectId(
          bookingData.userId.toString()
        ) as unknown as mongoose.Schema.Types.ObjectId,
        hostelId: new Types.ObjectId(
          bookingData.hostelId.toString()
        ) as unknown as mongoose.Schema.Types.ObjectId,
        providerId: new Types.ObjectId(
          bookingData.providerId.toString()
        ) as unknown as mongoose.Schema.Types.ObjectId,
        proof: Array.isArray(uploadResult)
          ? uploadResult[0].Location
          : uploadResult.Location,
        totalPrice,
        firstMonthRent,
        depositAmount,
        monthlyRent,
        selectedFacilities: transformedFacilities, // Use the transformed facilities directly
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
      console.error("Error creating booking in repository:", error);
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
    checkOut: Date
  ): Promise<boolean> {
    return await this.bookingRepository.checkBookingAvailability(
      hostelId,
      checkIn,
      checkOut
    );
  }

  async calculateBookingCost(
    hostelId: string,
    stayDurationInMonths: number,
    selectedFacilities: { id: string; duration: string }[]
  ): Promise<{
    totalPrice: number;
    depositAmount: number;
    monthlyRent: number;
    facilityCharges: number;
    firstMonthRent: number;
    transformedFacilities: IFacilitySelection[];
  }> {
    try {
      const hostel = await this.hostelRepository.getHostelById(hostelId);
      if (!hostel) {
        throw new AppError("Hostel not found", 404);
      }

      const monthlyRent = hostel.monthly_rent;
      const depositAmount = hostel.deposit_amount;

      let facilityCharges = 0;
      let facilityInitialCharge = 0;
      const transformedFacilities: IFacilitySelection[] = [];

      // Process each selected facility
      for (const selected of selectedFacilities) {
        // Find facility by ID
        const facility = await this.facilityRepository.findFacilityById(
          selected.id
        );

        if (!facility) {
          throw new AppError(`Facility with ID ${selected.id} not found`, 404);
        }

        // Calculate total cost based on duration and rate per day
        const totalCost = facility.price * parseInt(selected.duration);
        const firstMonthFacility = facility.price;
        facilityCharges += totalCost;
        facilityInitialCharge += firstMonthFacility;

        // Create facility selection object
        const facilitySelection: IFacilitySelection = {
          facilityId:
            facility.id.toString() as unknown as mongoose.Schema.Types.ObjectId,
          type: facility.name as
            | "Catering Service"
            | "Laundry Service"
            | "Deep Cleaning Service",
          startDate: new Date(), // Current date as start date
          endDate: new Date(
            Date.now() + parseInt(selected.duration) * 30 * 24 * 60 * 60 * 1000
          ), // duration months later
          duration: selected.duration,
          ratePerMonth: facility.price,
          totalCost: totalCost,
        };

        transformedFacilities.push(facilitySelection);
      }

      if (!monthlyRent || !depositAmount) {
        throw new AppError("Invalid hostel pricing data", 400);
      }

      const firstMonthRent =
        monthlyRent + depositAmount + facilityInitialCharge;
      
      console.log(firstMonthRent)

      const totalPrice =
        monthlyRent * stayDurationInMonths + depositAmount + facilityCharges;

      return {
        totalPrice,
        depositAmount,
        monthlyRent,
        facilityCharges,
        firstMonthRent,
        transformedFacilities,
      };
    } catch (error) {
      console.error("Error in calculateBookingCost:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Error calculating booking cost", 500);
    }
  }
}

export const bookingService = Container.get(BookingService);

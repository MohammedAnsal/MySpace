import {
  IBookingService,
  BookingCreateDTO,
  FacilityI,
} from "../../interface/user/booking.service.interface";
import { IBookingRepository } from "../../../repositories/interfaces/user/booking.Irepository";
import { IHostelRepository } from "../../../repositories/interfaces/user/hostel.Irepository";
import { IBooking, IFacilitySelection } from "../../../models/booking.model";
import { AppError } from "../../../utils/error";
import mongoose from "mongoose";
import { s3Service } from "../s3/s3.service";
import Container, { Service } from "typedi";
import { hostelRepository } from "../../../repositories/implementations/user/hostel.repository";
import { adminFacilityRepository } from "../../../repositories/implementations/admin/facility.repository";
import { IFacilityRepository } from "../../../repositories/interfaces/provider/facility.Irepository";
import { bookingRepository } from "../../../repositories/implementations/user/booking.repository";
import { notificationService } from "../notification/notification.service";
import { INotificationService } from "../../interface/notification/notification.service.interface";
import {
  BookingResponseDTO,
  CreateBookingDTO,
  CancelBookingDTO,
} from "../../../dtos/user/booking.dto";
import socketService from "../socket/socket.service";

@Service()
export class BookingService implements IBookingService {
  private s3Service: s3Service;
  private hostelRepository: IHostelRepository;
  private facilityRepository: IFacilityRepository;
  private bookingRepository: IBookingRepository;
  private notificationService: INotificationService;

  constructor(s3Service: s3Service) {
    this.s3Service = s3Service;
    this.hostelRepository = hostelRepository;
    this.facilityRepository = adminFacilityRepository;
    this.bookingRepository = bookingRepository;
    this.notificationService = notificationService;
  }

  private mapToBookingDTO(booking: any): BookingResponseDTO {
    return {
      _id: booking._id.toString(),
      userId: booking.userId,
      hostelId: booking.hostelId,
      providerId: booking.providerId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      stayDurationInMonths: booking.stayDurationInMonths,
      selectedFacilities: booking.selectedFacilities,
      bookingDate: booking.bookingDate,
      totalPrice: booking.totalPrice,
      firstMonthRent: booking.firstMonthRent,
      depositAmount: booking.depositAmount,
      monthlyRent: booking.monthlyRent,
      paymentStatus: booking.paymentStatus,
      proof: booking.proof,
      reason: booking.reason,
      created_at: booking.createdAt,
      updated_at: booking.updatedAt,
    };
  }

  async createBooking(
    bookingData: CreateBookingDTO,
    selectedFacilitiess: FacilityI[]
  ): Promise<BookingResponseDTO> {
    try {
      // Validate IDs before proceeding
      if (
        !bookingData.userId ||
        !bookingData.hostelId ||
        !bookingData.providerId
      ) {
        throw new AppError("Missing required IDs", 400);
      }

      // Validate ID formats
      if (!mongoose.Types.ObjectId.isValid(bookingData.userId)) {
        throw new AppError(
          `Invalid user ID format: ${bookingData.userId}`,
          400
        );
      }
      if (!mongoose.Types.ObjectId.isValid(bookingData.hostelId)) {
        throw new AppError(
          `Invalid hostel ID format: ${bookingData.hostelId}`,
          400
        );
      }
      if (!mongoose.Types.ObjectId.isValid(bookingData.providerId)) {
        throw new AppError(
          `Invalid provider ID format: ${bookingData.providerId}`,
          400
        );
      }

      const hostel = await this.hostelRepository.getHostelById(
        bookingData.hostelId
      );
      if (!hostel) {
        throw new AppError("Hostel not found", 404);
      }
      if (hostel.available_space !== null && hostel.available_space <= 0) {
        throw new AppError("No beds available in this hostel", 400);
      }

      // Check date availability
      // const isAvailable = await this.checkAvailability(
      //   bookingData.hostelId,
      //   bookingData.checkIn,
      //   bookingData.checkOut
      // );

      // if (!isAvailable) {
      //   throw new AppError(
      //     "Selected dates are not available for booking",
      //     400
      //   );
      // }

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
      const {
        totalPrice,
        depositAmount,
        monthlyRent,
        transformedFacilities,
        firstMonthRent,
      } = await this.calculateBookingCost(
        bookingData.hostelId,
        bookingData.stayDurationInMonths,
        selectedFacilitiess.map((facility) => ({
          id: facility.id.toString(),
          duration: String(facility.duration),
        }))
      );

      // Create booking with properly formatted ObjectIds
      const bookingDataToCreate = {
        ...bookingData,
        userId: new mongoose.Types.ObjectId(bookingData.userId),
        hostelId: new mongoose.Types.ObjectId(bookingData.hostelId),
        providerId: new mongoose.Types.ObjectId(bookingData.providerId),
        proof: Array.isArray(uploadResult)
          ? uploadResult[0].Location
          : uploadResult.Location,
        totalPrice,
        firstMonthRent,
        depositAmount,
        monthlyRent,
        selectedFacilities: transformedFacilities.map((facility) => ({
          ...facility,
          facilityId: new mongoose.Types.ObjectId(facility.facilityId),
        })),
      };

      console.log("Creating booking with data:", bookingDataToCreate);

      const booking = await this.bookingRepository.createBooking(
        bookingDataToCreate
      );

      // Create notification for the provider
      // await this.notificationService.createNotification({
      //   recipient: booking.providerId,
      //   sender: booking.userId,
      //   title: "New Booking Request",
      //   message: `You have received a new booking request for ${hostel.hostel_name}`,
      //   type: "hostel",
      //   // relatedId: booking._id
      // });

      return this.mapToBookingDTO(booking);
    } catch (error) {
      if (error instanceof AppError && bookingData.proof) {
        try {
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

  async getBookingById(bookingId: string): Promise<BookingResponseDTO> {
    try {
      const booking = await this.bookingRepository.getBookingById(bookingId);
      if (!booking) {
        throw new AppError("Booking not found", 404);
      }

      if (booking.proof) {
        booking.proof = await this.s3Service.generateSignedUrl(booking.proof);
      }

      return this.mapToBookingDTO(booking);
    } catch (error) {
      console.error("Error in getBookingById:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Error retrieving booking details", 500);
    }
  }

  async getProviderBookings(providerId: string): Promise<BookingResponseDTO[]> {
    try {
      const bookings = await this.bookingRepository.getProviderBookings(
        providerId
      );

      const bookingsWithSignedUrls = await Promise.all(
        bookings.map(async (booking) => {
          if (booking.proof) {
            booking.proof = await this.s3Service.generateSignedUrl(
              booking.proof
            );
          }
          return this.mapToBookingDTO(booking);
        })
      );

      return bookingsWithSignedUrls;
    } catch (error) {
      console.error("Error in getProviderBookings:", error);
      throw error;
    }
  }

  async getUserBookings(userId: string): Promise<BookingResponseDTO[]> {
    try {
      const bookings = await this.bookingRepository.getUserBookings(userId);

      const bookingsWithSignedUrls = await Promise.all(
        bookings.map(async (booking) => {
          if (booking.proof) {
            booking.proof = await this.s3Service.generateSignedUrl(
              booking.proof
            );
          }
          return this.mapToBookingDTO(booking);
        })
      );

      return bookingsWithSignedUrls;
    } catch (error) {
      console.error("Error in getUserBookings:", error);
      throw error;
    }
  }

  async getAllBookings(): Promise<BookingResponseDTO[]> {
    try {
      const bookings = await this.bookingRepository.getAllBookings();

      const bookingsWithSignedUrls = await Promise.all(
        bookings.map(async (booking) => {
          if (booking.proof) {
            booking.proof = await this.s3Service.generateSignedUrl(
              booking.proof
            );
          }
          return this.mapToBookingDTO(booking);
        })
      );

      return bookingsWithSignedUrls;
    } catch (error) {
      console.error("Error in getAllBookings:", error);
      throw error;
    }
  }

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

  async cancelBooking(
    bookingId: string,
    reason: CancelBookingDTO
  ): Promise<BookingResponseDTO> {
    const booking = await this.bookingRepository.getBookingByIdUnPopulated(
      bookingId
    );
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    // if (booking.paymentStatus === "cancelled") {
    //   throw new AppError("Booking is already cancelled", 400);
    // }

    const cancelledBooking = await this.bookingRepository.cancelBooking(
      bookingId,
      reason.reason
    );

    if (booking) {
      const hostel = await this.hostelRepository.findHostelByIdUnPopulated(
        String(booking.hostelId)
      );

      const notification = await this.notificationService.createNotification({
        recipient: new mongoose.Types.ObjectId(String(hostel?.provider_id)),
        sender: new mongoose.Types.ObjectId(String(booking?.userId)),
        title: "Hostel Booking Cancelled",
        message: `A booking for your hostel "${hostel?.hostel_name}" has been cancelled by the user.`,
        type: "booking",
        // relatedId: booking._id
      });

      socketService.emitNotification(String(booking?.providerId), notification);
    }

    if (!cancelledBooking) {
      throw new AppError("Failed to cancel booking", 500);
    }

    return this.mapToBookingDTO(cancelledBooking);
  }

  // async processPayment(
  //   bookingId: string,
  //   paymentDetails: any
  // ): Promise<IBooking> {
  //   const booking = await this.bookingRepository.getBookingById(bookingId);
  //   if (!booking) {
  //     throw new AppError("Booking not found", 404);
  //   }

  //   if (booking.paymentStatus === "completed") {
  //     throw new AppError("Booking is already paid", 400);
  //   }

  //   if (booking.paymentStatus === "cancelled") {
  //     throw new AppError("Cannot process payment for cancelled booking", 400);
  //   }

  //   // Process payment logic here
  //   // ... payment gateway integration

  //   const updatedBooking = await this.bookingRepository.updatePaymentStatus(
  //     bookingId,
  //     "completed"
  //   );
  //   if (!updatedBooking) {
  //     throw new AppError("Failed to update payment status", 500);
  //   }

  //   return updatedBooking;
  // }

  // async checkAvailability(
  //   hostelId: string,
  //   checkIn: Date,
  //   checkOut: Date
  // ): Promise<boolean> {
  //   return await this.bookingRepository.checkBookingAvailability(
  //     hostelId,
  //     checkIn,
  //     checkOut
  //   );
  // }

  //  Calculate Booking Charges :- (Fun)

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
    transformedFacilities: {
      facilityId: string;
      type: "Catering Service" | "Laundry Service" | "Deep Cleaning Service";
      startDate: Date;
      endDate: Date;
      duration: number;
      ratePerMonth: number;
      totalCost: number;
    }[];
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
      const transformedFacilities: {
        facilityId: string;
        type: "Catering Service" | "Laundry Service" | "Deep Cleaning Service";
        startDate: Date;
        endDate: Date;
        duration: number;
        ratePerMonth: number;
        totalCost: number;
      }[] = [];

      // Process each selected facility
      for (const selected of selectedFacilities) {
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
        const facilitySelection = {
          facilityId: facility.id.toString(),
          type: facility.name as
            | "Catering Service"
            | "Laundry Service"
            | "Deep Cleaning Service",
          startDate: new Date(),
          endDate: new Date(
            Date.now() + parseInt(selected.duration) * 30 * 24 * 60 * 60 * 1000
          ),
          duration: Number(selected.duration),
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

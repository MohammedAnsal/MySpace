import {
  IBookingService,
  FacilityI,
} from "../../interface/user/booking.service.interface";
import { IBookingRepository } from "../../../repositories/interfaces/user/booking.Irepository";
import { IHostelRepository } from "../../../repositories/interfaces/user/hostel.Irepository";
import { AppError } from "../../../utils/error";
import mongoose from "mongoose";
import { s3Service } from "../s3/s3.service";
import Container, { Service } from "typedi";
import { hostelRepository } from "../../../repositories/implementations/user/hostel.repository";
import { adminFacilityRepository } from "../../../repositories/implementations/admin/facility.repository";
import { IAdminFacilityRepository } from "../../../repositories/interfaces/admin/facility.Irepository";
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
  private facilityRepository: IAdminFacilityRepository;
  private bookingRepository: IBookingRepository;
  private notificationService: INotificationService;

  constructor(s3Service: s3Service) {
    this.s3Service = s3Service;
    this.hostelRepository = hostelRepository;
    this.facilityRepository = adminFacilityRepository;
    this.bookingRepository = bookingRepository;
    this.notificationService = notificationService;
  }

  //  For DTO check :-

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

  //  Create booking :-

  async createBooking(
    bookingData: CreateBookingDTO,
    selectedFacilitiess: FacilityI[]
  ): Promise<BookingResponseDTO> {
    try {
      if (
        !bookingData.userId ||
        !bookingData.hostelId ||
        !bookingData.providerId
      ) {
        throw new AppError("Missing required IDs", 400);
      }

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

      if (!bookingData.proof || !bookingData.proof.buffer) {
        throw new AppError("Proof document is required", 400);
      }

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

      const booking = await this.bookingRepository.createBooking(
        bookingDataToCreate
      );

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

  //  Get single booking details :-

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

  //  Get provider bookig's :-

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

  //  Get user bookig's :-

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

  //  Get all bookig's :-

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

  //  Cancel booking :-

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
      });

      socketService.emitNotification(String(booking?.providerId), notification);
    }

    if (!cancelledBooking) {
      throw new AppError("Failed to cancel booking", 500);
    }

    return this.mapToBookingDTO(cancelledBooking);
  }

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

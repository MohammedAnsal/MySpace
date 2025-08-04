import {
  IBookingService,
  FacilityI,
} from "../../interface/user/booking.service.interface";
import { IBookingRepository } from "../../../repositories/interfaces/user/booking.Irepository";
import { IHostelRepository } from "../../../repositories/interfaces/user/hostel.Irepository";
import { AppError } from "../../../utils/error";
import mongoose from "mongoose";
import { Types } from "mongoose";
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
  mapToBookingDTO,
} from "../../../dtos/user/booking.dto";
import socketService from "../socket/socket.service";
import { HttpStatus } from "../../../enums/http.status";

interface PopulatedId {
  _id: Types.ObjectId;
}

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

  //  Create booking :-

  async createBooking(
    bookingData: CreateBookingDTO,
    selectedFacilitiess: FacilityI[]
  ): Promise<BookingResponseDTO> {
    const session = await mongoose.startSession();
    let uploadResult: any = null;

    try {
      session.startTransaction();

      if (
        !bookingData.userId ||
        !bookingData.hostelId ||
        !bookingData.providerId
      ) {
        throw new AppError("Missing required IDs", HttpStatus.BAD_REQUEST);
      }

      // Validate ObjectIds
      if (!mongoose.Types.ObjectId.isValid(bookingData.userId)) {
        throw new AppError(
          `Invalid user ID format: ${bookingData.userId}`,
          HttpStatus.BAD_REQUEST
        );
      }
      if (!mongoose.Types.ObjectId.isValid(bookingData.hostelId)) {
        throw new AppError(
          `Invalid hostel ID format: ${bookingData.hostelId}`,
          HttpStatus.BAD_REQUEST
        );
      }
      if (!mongoose.Types.ObjectId.isValid(bookingData.providerId)) {
        throw new AppError(
          `Invalid provider ID format: ${bookingData.providerId}`,
          HttpStatus.BAD_REQUEST
        );
      }

      // CRITICAL: Atomic check and update of available space
      const hostel = await this.hostelRepository.getHostelByIdWithLock(
        bookingData.hostelId,
        session
      );

      if (!hostel) {
        throw new AppError("Hostel not found", HttpStatus.NOT_FOUND);
      }

      if (hostel.available_space !== null && hostel.available_space <= 0) {
        throw new AppError(
          "No beds available in this hostel",
          HttpStatus.BAD_REQUEST
        );
      }

      // Decrease available space atomically
      const updatedHostel = await this.hostelRepository.decreaseAvailableSpace(
        bookingData.hostelId,
        session
      );

      if (
        !updatedHostel ||
        (updatedHostel.available_space !== null &&
          updatedHostel.available_space < 0)
      ) {
        throw new AppError(
          "No beds available in this hostel",
          HttpStatus.BAD_REQUEST
        );
      }

      // Upload proof document
      if (!bookingData.proof || !bookingData.proof.buffer) {
        throw new AppError(
          "Proof document is required",
          HttpStatus.BAD_REQUEST
        );
      }

      uploadResult = await this.s3Service.uploadFile(
        bookingData.proof,
        "proof"
      );

      if (
        !uploadResult ||
        (Array.isArray(uploadResult)
          ? !uploadResult[0].Location
          : !uploadResult.Location)
      ) {
        throw new AppError(
          "Failed to upload proof document",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
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
        })),
        bookingData.checkIn
      );

      // Create booking with session
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
        paymentExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 minitues
        selectedFacilities: transformedFacilities.map((facility) => ({
          ...facility,
          facilityId: new mongoose.Types.ObjectId(facility.facilityId),
        })),
      };

      const booking = await this.bookingRepository.createBookingWithSession(
        bookingDataToCreate,
        session
      );

      // Commit transaction
      await session.commitTransaction();

      return mapToBookingDTO(booking);
    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();

      // Only try to delete S3 file if upload was successful
      if (error instanceof AppError && uploadResult) {
        try {
          const s3Url = Array.isArray(uploadResult)
            ? uploadResult[0].Location
            : uploadResult.Location;

          if (s3Url) {
            await this.s3Service.delete_File([s3Url]);
          }
        } catch (deleteError) {
          console.error(
            "Failed to delete S3 file after booking error:",
            deleteError
          );
        }
      }
      console.error("Error creating booking in repository:", error);
      throw error;
    } finally {
      // End session
      session.endSession();
    }
  }

  //  Get single booking details :-

  async getBookingById(bookingId: string): Promise<BookingResponseDTO> {
    try {
      const booking = await this.bookingRepository.getBookingById(bookingId);
      if (!booking) {
        throw new AppError("Booking not found", HttpStatus.NOT_FOUND);
      }

      if (booking.proof) {
        booking.proof = await this.s3Service.generateSignedUrl(booking.proof);
      }

      return mapToBookingDTO(booking);
    } catch (error) {
      console.error("Error in getBookingById:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error retrieving booking details",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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
          return mapToBookingDTO(booking);
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
          return mapToBookingDTO(booking);
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
          return mapToBookingDTO(booking);
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
      throw new AppError("Booking not found", HttpStatus.NOT_FOUND);
    }

    const cancelledBooking = await this.bookingRepository.cancelBooking(
      bookingId,
      reason.reason
    );

    if (booking) {
      const hostel = await this.hostelRepository.findHostelByIdUnPopulated(
        String(booking.hostelId)
      );

      await this.hostelRepository.increaseAvailableSpace(
        String(booking.hostelId)
      );

      const notification = await this.notificationService.createNotification({
        recipient: new mongoose.Types.ObjectId(String(hostel?.provider_id)),
        sender: new mongoose.Types.ObjectId(String(booking?.userId)),
        title: "Hostel Booking Cancelled",
        message: `A booking for your hostel "${hostel?.hostel_name}" has been cancelled by the user.`,
        type: "booking",
      });

      socketService.emitNotification(String(booking?.providerId), {
        ...notification,
        recipient: notification.recipient.toString(),
      });
    }

    if (!cancelledBooking) {
      throw new AppError(
        "Failed to cancel booking",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return mapToBookingDTO(cancelledBooking);
  }

  //  Calculate Booking Charges :- (Fun)

  async calculateBookingCost(
    hostelId: string,
    stayDurationInMonths: number,
    selectedFacilities: { id: string; duration: string }[],
    checkIn: Date
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
        throw new AppError("Hostel not found", HttpStatus.NOT_FOUND);
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
          throw new AppError(
            `Facility with ID ${selected.id} not found`,
            HttpStatus.NOT_FOUND
          );
        }

        // Calculate total cost based on duration and rate per day
        const totalCost = facility.price * parseInt(selected.duration);
        const firstMonthFacility = facility.price;
        facilityCharges += totalCost;
        facilityInitialCharge += firstMonthFacility;

        // Use checkIn as the start date
        const startDate = new Date(checkIn);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + parseInt(selected.duration));

        // Create facility selection object
        const facilitySelection = {
          facilityId: facility.id.toString(),
          type: facility.name as
            | "Catering Service"
            | "Laundry Service"
            | "Deep Cleaning Service",
          startDate, // <-- Use checkIn
          endDate, // <-- Calculated based on duration
          duration: Number(selected.duration),
          ratePerMonth: facility.price,
          totalCost: totalCost,
        };

        transformedFacilities.push(facilitySelection);
      }

      if (!monthlyRent || !depositAmount) {
        throw new AppError(
          "Invalid hostel pricing data",
          HttpStatus.BAD_REQUEST
        );
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
      throw new AppError(
        "Error calculating booking cost",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addFacilitiesToBooking(
    bookingId: string,
    userId: string,
    facilities: {
      id: string;
      startDate: string;
      duration: number;
      name?: string;
    }[]
  ): Promise<BookingResponseDTO> {
    console.log(facilities, "in servicee");

    const booking = await this.bookingRepository.getBookingById(bookingId);
    if (!booking) throw new AppError("Booking not found", HttpStatus.NOT_FOUND);

    const userIdd = (booking.userId as unknown as PopulatedId)._id.toString();
    if (userIdd !== userId)
      throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

    const transformedFacilities = [];
    for (const f of facilities) {
      const facility = await this.facilityRepository.findFacilityById(f.id);
      if (!facility)
        throw new AppError("Facility not found", HttpStatus.NOT_FOUND);

      const startDate = new Date(f.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + f.duration);

      transformedFacilities.push({
        facilityId: facility._id,
        type: facility.name,
        startDate,
        endDate,
        duration: f.duration,
        ratePerMonth: facility.price,
        totalCost: facility.price * f.duration,
      });
    }

    const updatedBooking = await this.bookingRepository.addFacilitiesToBooking(
      bookingId,
      transformedFacilities
    );

    if (!updatedBooking) {
      throw new AppError(
        "Booking not found after update",
        HttpStatus.NOT_FOUND
      );
    }

    return mapToBookingDTO(updatedBooking);
  }
}

export const bookingService = Container.get(BookingService);

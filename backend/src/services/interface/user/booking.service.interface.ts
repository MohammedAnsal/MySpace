import { IFacilitySelection } from "../../../models/booking.model";
import {
  BookingResponseDTO,
  CreateBookingDTO,
  CancelBookingDTO,
} from "../../../dtos/user/booking.dto";

export interface BookingCreateDTO {
  userId: string;
  hostelId: string;
  providerId: string;
  checkIn: Date;
  checkOut: Date;
  stayDurationInMonths: number;
  selectedFacilities: IFacilitySelection[];
  proof: Express.Multer.File | null;
}

export interface FacilityI {
  id: string;
  duration: string;
}

export interface BookingUpdateDTO {
  checkIn?: Date;
  checkOut?: Date;
  stayDurationInMonths?: number;
  selectedFacilities?: IFacilitySelection[];
  proof?: Express.Multer.File | null;
}

export interface IBookingService {
  createBooking(
    bookingData: CreateBookingDTO,
    selectedFacilities: Array<{ id: string; duration: string }>
  ): Promise<BookingResponseDTO>;

  // getBookingDetails(bookingId: string): Promise<IBooking>;
  getUserBookings(userId: string): Promise<BookingResponseDTO[]>;
  getProviderBookings(providerId: string): Promise<BookingResponseDTO[]>;
  getAllBookings(): Promise<BookingResponseDTO[]>;

  // getHostelBookings(hostelId: string): Promise<IBooking[]>;

  // updateBooking(bookingId: string, updateData: BookingUpdateDTO): Promise<IBooking>;

  cancelBooking(
    bookingId: string,
    reason: CancelBookingDTO
  ): Promise<BookingResponseDTO>;
  getBookingById(bookingId: string): Promise<BookingResponseDTO>;
  // processPayment(bookingId: string, paymentDetails: any): Promise<IBooking>;

  // checkAvailability(
  //   hostelId: string,
  //   checkIn: Date,
  //   checkOut: Date,
  //   selectedSpace: string
  // ): Promise<boolean>;

  calculateBookingCost(
    hostelId: string,
    stayDurationInMonths: number,
    selectedFacilities: Array<{ id: string; duration: string }>
  ): Promise<{
    totalPrice: number;
    depositAmount: number;
    monthlyRent: number;
    facilityCharges: number;
    firstMonthRent: number;
    transformedFacilities: Array<{
      facilityId: string;
      type: "Catering Service" | "Laundry Service" | "Deep Cleaning Service";
      startDate: Date;
      endDate: Date;
      duration: number;
      ratePerMonth: number;
      totalCost: number;
    }>;
  }>;
}

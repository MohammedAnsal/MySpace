import { IBooking, IFacilitySelection } from "../../../models/booking.model";

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
    bookingData: BookingCreateDTO,
    selectedFacilitiess: FacilityI[]
  ): Promise<IBooking>;

  // getBookingDetails(bookingId: string): Promise<IBooking>;

  // getUserBookings(userId: string): Promise<IBooking[]>;

  // getHostelBookings(hostelId: string): Promise<IBooking[]>;

  // updateBooking(bookingId: string, updateData: BookingUpdateDTO): Promise<IBooking>;

  // cancelBooking(bookingId: string): Promise<IBooking>;

  // processPayment(bookingId: string, paymentDetails: any): Promise<IBooking>;

  checkAvailability(
    hostelId: string,
    checkIn: Date,
    checkOut: Date,
    selectedSpace: string
  ): Promise<boolean>;

  calculateBookingCost(
    hostelId: string,
    stayDurationInMonths: number,
    selectedFacilities: { id: string; duration: string }[]
  ): Promise<{
    totalPrice: number;
    depositAmount: number;
    monthlyRent: number;
    facilityCharges: number;
    firstMonthRent: number;
  }>;
}

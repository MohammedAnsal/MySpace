import { IBooking, IFacilitySelection } from "../../models/booking.model";
import mongoose from "mongoose";

// Add interfaces for populated types
interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
}

interface PopulatedHostel {
  _id: mongoose.Types.ObjectId;
  hostel_name: string;
  location: {
    _id: mongoose.Types.ObjectId;
    address: string;
    latitude: number;
    longitude: number;
  };
  facilities: any[];
}

interface PopulatedFacility {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
}

interface FacilityDTO {
  _id: string;
  name: string;
  price: number;
  description: string;
}

export interface MonthlyPaymentDTO {
  month: number;
  dueDate: Date; // Rent due date for this month
  status: "pending" | "completed";
  paid: boolean;
  paidAt: Date | null;
  reminderSent: boolean; // Whether reminder was sent
}

export interface BookingResponseDTO {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  hostelId: {
    _id: string;
    hostel_name: string;
    location: {
      _id: string;
      address: string;
      latitude: number;
      longitude: number;
    };
    facilities: FacilityDTO[];
  };
  providerId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  checkIn: Date;
  checkOut: Date;
  stayDurationInMonths: number;
  selectedFacilities: Array<{
    facilityId: {
      _id: string;
      name: string;
      description: string;
    };
    type: "Catering Service" | "Laundry Service" | "Deep Cleaning Service";
    startDate: Date;
    endDate: Date;
    duration: number;
    ratePerMonth: number;
    totalCost: number;
  }>;

  monthlyPayments: MonthlyPaymentDTO[];

  bookingDate: Date;
  totalPrice: number;
  firstMonthRent: number;
  depositAmount: number;
  monthlyRent: number;
  paymentStatus: "pending" | "completed" | "cancelled" | "expired";
  proof: string;
  reason: string;
  paymentExpiry: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBookingDTO {
  userId: string;
  hostelId: string;
  providerId: string;
  checkIn: Date;
  checkOut: Date;
  stayDurationInMonths: number;
  selectedFacilities: Array<{
    id: string;
    duration: string;
  }>;
  proof: Express.Multer.File | null;
}

export interface CancelBookingDTO {
  reason: string;
}

export interface BookingFiltersDTO {
  status?: "pending" | "completed" | "cancelled";
  startDate?: Date;
  endDate?: Date;
  sortBy?: "asc" | "desc";
}

export function mapToBookingDTO(booking: IBooking): BookingResponseDTO {
  // Helper type guards
  function isPopulatedUser(obj: unknown): obj is PopulatedUser {
    return (
      !!obj &&
      typeof (obj as PopulatedUser).fullName === "string" &&
      typeof (obj as PopulatedUser).email === "string" &&
      typeof (obj as PopulatedUser).phone === "string"
    );
  }

  function isPopulatedHostel(obj: unknown): obj is PopulatedHostel {
    return (
      !!obj &&
      typeof (obj as PopulatedHostel).hostel_name === "string" &&
      !!(obj as PopulatedHostel).location
    );
  }

  function isPopulatedFacility(obj: unknown): obj is PopulatedFacility {
    return (
      !!obj &&
      typeof (obj as PopulatedFacility).name === "string" &&
      typeof (obj as PopulatedFacility).description === "string"
    );
  }

  return {
    _id: (booking._id as mongoose.Types.ObjectId).toString(),
    userId: isPopulatedUser(booking.userId)
      ? {
          _id: booking.userId._id.toString(),
          fullName: booking.userId.fullName,
          email: booking.userId.email,
          phone: booking.userId.phone,
        }
      : {
          _id: booking.userId.toString(),
          fullName: "",
          email: "",
          phone: "",
        },
    hostelId: isPopulatedHostel(booking.hostelId)
      ? {
          _id: booking.hostelId._id.toString(),
          hostel_name: booking.hostelId.hostel_name,
          location: {
            _id: booking.hostelId.location._id.toString(),
            address: booking.hostelId.location.address,
            latitude: booking.hostelId.location.latitude,
            longitude: booking.hostelId.location.longitude,
          },
          facilities: Array.isArray(booking.hostelId.facilities)
            ? booking.hostelId.facilities.map((f: any) => ({
                _id: f._id.toString(),
                name: f.name,
                price: f.price,
                description: f.description,
              }))
            : [],
        }
      : {
          _id: booking.hostelId.toString(),
          hostel_name: "",
          location: {
            _id: "",
            address: "",
            latitude: 0,
            longitude: 0,
          },
          facilities: [],
        },
    providerId: isPopulatedUser(booking.providerId)
      ? {
          _id: booking.providerId._id.toString(),
          fullName: booking.providerId.fullName,
          email: booking.providerId.email,
          phone: booking.providerId.phone,
        }
      : {
          _id: booking.providerId.toString(),
          fullName: "",
          email: "",
          phone: "",
        },
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    stayDurationInMonths: booking.stayDurationInMonths,
    selectedFacilities: booking.selectedFacilities.map((facility) => ({
      facilityId: isPopulatedFacility(facility.facilityId)
        ? {
            _id: facility.facilityId._id.toString(),
            name: facility.facilityId.name,
            description: facility.facilityId.description,
          }
        : {
            _id: facility.facilityId.toString(),
            name: "",
            description: "",
          },
      type: facility.type,
      startDate: facility.startDate,
      endDate: facility.endDate,
      duration: facility.duration,
      ratePerMonth: facility.ratePerMonth,
      totalCost: facility.totalCost,
    })),
    // Map monthly payments
    monthlyPayments:
      booking.monthlyPayments?.map((mp) => ({
        month: mp.month,
        dueDate: mp.dueDate,
        status: mp.status,
        paid: mp.paid,
        paidAt: mp.paidAt || null,
        reminderSent: mp.reminderSent,
      })) || [],
    bookingDate: booking.bookingDate,
    totalPrice: booking.totalPrice,
    firstMonthRent: booking.firstMonthRent,
    depositAmount: booking.depositAmount,
    monthlyRent: booking.monthlyRent,
    paymentStatus: booking.paymentStatus,
    proof: booking.proof,
    reason: booking.reason,
    paymentExpiry: booking.paymentExpiry,
    created_at: booking.createdAt,
    updated_at: booking.updatedAt,
  };
}

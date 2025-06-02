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
  bookingDate: Date;
  totalPrice: number;
  firstMonthRent: number;
  depositAmount: number;
  monthlyRent: number;
  paymentStatus: "pending" | "completed" | "cancelled";
  proof: string;
  reason: string;
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

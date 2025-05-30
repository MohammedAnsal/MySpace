import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  FileCheck,
  AlertCircle,
  MapPin,
  Calendar as CalendarIcon,
  Timer,
  Coffee,
  Wind,
  Shirt,
  Star,
} from "lucide-react";
import RatingModal from "./RatingModal";
import { createRating } from "@/services/Api/userApi";
import { useUserRating } from "@/hooks/user/hostel/useHostel";
import MapModal from "./MapModal";
import { motion } from "framer-motion";

interface Facility {
  facilityId: {
    _id: string;
    name: string;
    description?: string;
  };
  type: string;
  ratePerMonth: number;
  totalCost: number;
  duration: string;
  startDate: string;
  endDate: string;
}

interface Location {
  _id: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: string;
  longitude?: string;
}

interface Booking {
  _id: string;
  hostelId: {
    _id: string;
    hostel_name: string;
    location: Location;
  };
  userId: string;
  bookingDate: string;
  checkIn: string;
  checkOut: string;
  stayDurationInMonths: number;
  firstMonthRent: number;
  monthlyRent: number;
  totalPrice: number;
  depositAmount: number;
  paymentStatus: string;
  proof: string;
  providerId: string;
  selectedFacilities: Facility[];
}

interface BookingDetailsProps {
  booking: Booking;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking }) => {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Fetch user's existing rating for this hostel
  const {
    data: userRating,
    isLoading: isRatingLoading,
    refetch: refetchUserRating,
  } = useUserRating(booking.hostelId._id, booking._id);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getFacilityName = (facility: any) => {
    if (!facility) return "Unknown Facility";

    if (
      facility.facilityId &&
      typeof facility.facilityId === "object" &&
      facility.facilityId.name
    ) {
      return facility.facilityId.name;
    }

    return facility.type || "Facility";
  };

  const getFacilityDescription = (facility: any) => {
    if (
      facility.facilityId &&
      typeof facility.facilityId === "object" &&
      facility.facilityId.description
    ) {
      return facility.facilityId.description;
    }
    return null;
  };

  const getFacilityPrice = (facility: any) => {
    if (!facility) return 0;
    return facility.ratePerMonth || 0;
  };

  const calculateTotalFacilitiesCost = (facilities: any[]) => {
    if (!facilities || !Array.isArray(facilities) || facilities.length === 0)
      return 0;
    return facilities.reduce((total, facility) => {
      return total + (facility.totalCost || 0);
    }, 0);
  };

  const hasLocationDetails = () => {
    return (
      booking.hostelId?.location &&
      (booking.hostelId.location.address ||
        booking.hostelId.location.city ||
        booking.hostelId.location.state ||
        booking.hostelId.location.zipCode)
    );
  };

  const getFacilityIcon = (facilityName: string) => {
    const name = facilityName.toLowerCase();

    if (name.includes("catering") || name.includes("food")) {
      return <Coffee className="text-white" size={14} />;
    } else if (name.includes("deep cleaning") || name.includes("cleaning")) {
      return <Wind className="text-white" size={14} />;
    } else if (name.includes("laundry")) {
      return <Shirt className="text-white" size={14} />;
    } else {
      // Fallback icon
      return <Clock className="text-white" size={14} />;
    }
  };

  const calculateDurationInMonths = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Calculate the difference in months
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

      return months <= 0 ? 1 : months; // Ensure minimum of 1 month
    } catch (error) {
      return "—";
    }
  };

  const getIconColor = (facilityName: string) => {
    const name = facilityName.toLowerCase();

    if (name.includes("catering") || name.includes("food")) {
      return "bg-orange-500";
    } else if (name.includes("deep cleaning") || name.includes("cleaning")) {
      return "bg-blue-500";
    } else if (name.includes("laundry")) {
      return "bg-purple-500";
    } else {
      return "bg-[#b9a089]";
    }
  };

  const handleSubmitRating = async (rating: number, comment: string) => {
    try {
      const ratingData = {
        user_id: booking.userId,
        hostel_id: booking.hostelId._id,
        booking_id:booking._id,
        rating,
        comment,
      };

      await createRating(ratingData);
      // Refetch rating after submission
      refetchUserRating();
      return Promise.resolve();
    } catch (error) {
      console.error("Error submitting rating:", error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="p-6 pt-0 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm uppercase font-semibold text-gray-500 mb-4 flex items-center">
            <Calendar className="text-[#b9a089] mr-2" size={16} />
            Stay Information
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2">
              <p className="text-sm font-medium text-gray-600">Check-in</p>
              <p className="text-sm text-gray-800 font-medium">
                {formatDate(booking.checkIn)}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2">
              <p className="text-sm font-medium text-gray-600">Check-out</p>
              <p className="text-sm text-gray-800 font-medium">
                {formatDate(booking.checkOut)}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="text-sm text-gray-800 font-medium">
                {booking.stayDurationInMonths} months
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm uppercase font-semibold text-gray-500 mb-4 flex items-center">
            <CreditCard className="text-[#b9a089] mr-2" size={16} />
            Payment Details
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2">
              <p className="text-sm font-medium text-gray-600">
                First Month Rent
              </p>
              <p className="text-sm text-gray-800 font-medium">
                ${booking.firstMonthRent}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2">
              <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
              <p className="text-sm text-gray-800 font-medium">
                ${booking.monthlyRent}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-600">
                Security Deposit
              </p>
              <p className="text-sm text-gray-800 font-medium">
                ${booking.depositAmount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Details (if available) */}
      {hasLocationDetails() && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm uppercase font-semibold text-gray-500 mb-4 flex items-center">
            <MapPin className="text-[#b9a089] mr-2" size={16} />
            Location Details
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              {booking.hostelId.location.address && (
                <div className="flex items-start">
                  <span className="text-sm font-medium text-gray-800">
                    {booking.hostelId.location.address}
                  </span>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMapModalOpen(true)}
                className="mt-2 px-3 py-1 text-sm bg-[#b9a089] text-white rounded-md hover:bg-[#a58e77]"
              >
                View on Map
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {isMapModalOpen && booking.hostelId.location && (
        <MapModal
          location={{
            latitude: parseFloat(booking.hostelId.location.latitude || "0"),
            longitude: parseFloat(booking.hostelId.location.longitude || "0"),
            address: booking.hostelId.location.address || "Unknown Address",
            hostelName:booking.hostelId.hostel_name
          }}
          onClose={() => setIsMapModalOpen(false)}
        />
      )}

      {/* Selected facilities - ENHANCED VERSION */}
      {booking.selectedFacilities && booking.selectedFacilities.length > 0 ? (
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm uppercase font-semibold text-gray-500 mb-4 flex items-center">
            <Clock className="text-[#b9a089] mr-2" size={16} />
            Selected Facilities
          </h4>

          {/* Facility Cards with expanded details */}
          <div className="space-y-4">
            {booking.selectedFacilities.map((facility, index) => {
              const facilityName = getFacilityName(facility);
              const calculatedDuration =
                facility.startDate && facility.endDate
                  ? calculateDurationInMonths(
                      facility.startDate,
                      facility.endDate
                    )
                  : facility.duration || "—";

              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                >
                  {/* Facility Header */}
                  <div className="bg-[#b9a089]/10 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className={`rounded-full ${getIconColor(
                          facilityName
                        )} p-2 mr-3`}
                      >
                        {getFacilityIcon(facilityName)}
                      </div>
                      <h3 className="font-medium text-gray-900">
                        {facilityName}
                      </h3>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#b9a089]/20 text-[#b9a089]">
                      ${getFacilityPrice(facility)}/month
                    </span>
                  </div>

                  {/* Facility Details */}
                  <div className="px-4 py-3">
                    {getFacilityDescription(facility) && (
                      <p className="text-sm text-gray-600 mb-3">
                        {getFacilityDescription(facility)}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {/* Duration (calculated from start and end dates) */}
                      <div className="flex items-center">
                        <Timer className="text-gray-400 mr-2" size={14} />
                        <span className="text-gray-700">
                          Duration:{" "}
                          <span className="font-medium">
                            {calculatedDuration} months
                          </span>
                        </span>
                      </div>

                      {/* Total Cost */}
                      <div className="flex items-center">
                        <CreditCard className="text-gray-400 mr-2" size={14} />
                        <span className="text-gray-700">
                          Total:{" "}
                          <span className="font-medium">
                            ${facility.totalCost || "—"}
                          </span>
                        </span>
                      </div>

                      {/* Start Date */}
                      {facility.startDate && (
                        <div className="flex items-center">
                          <CalendarIcon
                            className="text-gray-400 mr-2"
                            size={14}
                          />
                          <span className="text-gray-700">
                            Start:{" "}
                            <span className="font-medium">
                              {formatDate(facility.startDate)}
                            </span>
                          </span>
                        </div>
                      )}

                      {/* End Date */}
                      {facility.endDate && (
                        <div className="flex items-center">
                          <CalendarIcon
                            className="text-gray-400 mr-2"
                            size={14}
                          />
                          <span className="text-gray-700">
                            End:{" "}
                            <span className="font-medium">
                              {formatDate(facility.endDate)}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Facilities Total */}
          <div className="mt-4 bg-[#b9a089]/5 p-4 rounded-lg border border-[#b9a089]/10 flex justify-between items-center">
            <p className="text-sm font-medium text-gray-600">
              Total Facilities Cost
            </p>
            <p className="text-lg font-bold text-[#b9a089]">
              ${calculateTotalFacilitiesCost(booking.selectedFacilities)}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
            <AlertCircle className="text-gray-400 mr-2" size={16} />
            <p className="text-sm text-gray-500">
              No additional facilities selected
            </p>
          </div>
        </div>
      )}

      {/* Document and booking date */}
      <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
        {booking.proof && (
          <a
            href={booking.proof}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center px-4 py-2 border border-blue-100 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <FileCheck className="mr-2" size={16} />
            View Uploaded Document
          </a>
        )}

        <div className="text-xs text-gray-500">
          <span className="inline-block px-2 py-1 bg-gray-50 rounded-md">
            Booked on: {formatDate(booking.bookingDate)}
          </span>
        </div>
      </div>

      {/* Rating Button - Only show for completed bookings */}
      {booking.paymentStatus === "completed" && (
        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <div>
            <h4 className="text-sm uppercase font-semibold text-gray-500 flex items-center">
              <Star className="text-[#b9a089] mr-2" size={16} />
              {userRating ? "Your Rating" : "Rate Your Stay"}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {userRating
                ? "Thank you for sharing your experience"
                : "Share your experience to help other users"}
            </p>
          </div>

          {isRatingLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
          ) : userRating ? (
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={
                    star <= userRating.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="ml-2 text-sm font-medium text-gray-700">
                {userRating.rating}/5
              </span>
            </div>
          ) : (
            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-[#b9a089] rounded-md hover:bg-[#a58e77] transition-colors"
            >
              Rate Hostel
            </button>
          )}

          {/* Rating Modal */}
          <RatingModal
            isOpen={isRatingModalOpen}
            onClose={() => setIsRatingModalOpen(false)}
            hostelId={booking.hostelId._id}
            userId={booking.userId}
            onSubmit={handleSubmitRating}
          />
        </div>
      )}
    </div>
  );
};

export default BookingDetails;

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
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  IndianRupee,
} from "lucide-react";
import RatingModal from "./RatingModal";
import { createRating } from "@/services/Api/userApi";
import { useUserRating } from "@/hooks/user/hostel/useHostel";
import MapModal from "./MapModal";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useMonthlyPayment } from "@/hooks/user/booking/useBooking";

interface MonthlyPayment {
  month: number;
  dueDate: string;
  status: "pending" | "completed";
  paid: boolean;
  paidAt: string | null;
  reminderSent: boolean;
}

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
  monthlyPayments?: MonthlyPayment[];
}

interface BookingDetailsProps {
  booking: Booking;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking }) => {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [showAllPayments, setShowAllPayments] = useState(false);

  // Fetch user's existing rating for this hostel
  const {
    data: userRating,
    isLoading: isRatingLoading,
    refetch: refetchUserRating,
  } = useUserRating(booking.hostelId._id, booking._id);

  const {
    mutate: processMonthlyPaymentMutation,
    isPending: isProcessingMonthlyPayment,
  } = useMonthlyPayment();

  // Add this function after your existing helper functions
  const handlePayNow = async (month: number) => {
    try {
      processMonthlyPaymentMutation(
        { bookingId: booking._id, month },
        {
          onSuccess: (response) => {
            if (response?.data?.checkoutUrl) {
              window.location.href = response.data.checkoutUrl;
              toast.success("Redirecting to payment...");
            } else {
              toast.error("Payment session creation failed");
            }
          },
          onError: (error) => {
            console.error("Payment processing error:", error);
            toast.error("Failed to process payment. Please try again later.");
          },
        }
      );
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment. Please try again.");
    }
  };

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

  const formatMonthName = (monthNumber: number, checkInDate: string) => {
    try {
      const checkIn = new Date(checkInDate);
      const monthDate = new Date(checkIn);
      monthDate.setMonth(checkIn.getMonth() + monthNumber - 1);

      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(monthDate);
    } catch (error) {
      return `Month ${monthNumber}`;
    }
  };

  const getPaymentStatusIcon = (status: string, paid: boolean) => {
    if (paid || status === "completed") {
      return <CheckCircle className="text-green-500" size={18} />;
    } else {
      return <AlertTriangle className="text-amber-500" size={18} />;
    }
  };

  const getPaymentStatusColor = (status: string, paid: boolean) => {
    if (paid || status === "completed") {
      return "bg-green-50 border-green-200 text-green-800";
    } else {
      return "bg-amber-50 border-amber-200 text-amber-800";
    }
  };

  const getPaymentStatusText = (status: string, paid: boolean) => {
    if (paid || status === "completed") {
      return "Paid";
    } else {
      return "Pending";
    }
  };

  const isPaymentOverdue = (dueDate: string, status: string, paid: boolean) => {
    if (paid || status === "completed") return false;
    const due = new Date(dueDate);
    const now = new Date();
    return now > due;
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
      return <Clock className="text-white" size={14} />;
    }
  };

  const calculateDurationInMonths = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

      return months <= 0 ? 1 : months;
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
        booking_id: booking._id,
        rating,
        comment,
      };

      await createRating(ratingData);
      refetchUserRating();
      return Promise.resolve();
    } catch (error) {
      console.error("Error submitting rating:", error);
      return Promise.reject(error);
    }
  };

  // Calculate payment statistics
  const paymentStats = React.useMemo(() => {
    if (!booking.monthlyPayments || booking.monthlyPayments.length === 0) {
      return { total: 0, paid: 0, pending: 0, overdue: 0 };
    }

    const total = booking.monthlyPayments.length;
    const paid = booking.monthlyPayments.filter(
      (mp) => mp.paid || mp.status === "completed"
    ).length;
    const pending = booking.monthlyPayments.filter(
      (mp) => !mp.paid && mp.status === "pending"
    ).length;
    const overdue = booking.monthlyPayments.filter((mp) =>
      isPaymentOverdue(mp.dueDate, mp.status, mp.paid)
    ).length;

    return { total, paid, pending, overdue };
  }, [booking.monthlyPayments]);

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
                ₹{booking.firstMonthRent}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2">
              <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
              <p className="text-sm text-gray-800 font-medium">
                ₹{booking.monthlyRent}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-600">
                Security Deposit
              </p>
              <p className="text-sm text-gray-800 font-medium">
                ₹{booking.depositAmount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Payments Section - SMART UI FOR DIFFERENT DURATIONS */}
      {booking.monthlyPayments && booking.monthlyPayments.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm uppercase font-semibold text-gray-500 flex items-center">
              <IndianRupee className="text-[#b9a089] mr-2" size={16} />
              Monthly Payment Schedule
            </h4>

            {/* Show total count */}
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {booking.monthlyPayments.length} payments
            </span>
          </div>

          {/* Payment Statistics */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-gray-600">{paymentStats.paid} Paid</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-1"></div>
                <span className="text-gray-600">
                  {paymentStats.pending} Pending
                </span>
              </div>
              {paymentStats.overdue > 0 && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-red-600">
                    {paymentStats.overdue} Overdue
                  </span>
                </div>
              )}
            </div>

            {!showAllPayments && booking.monthlyPayments.length > 3 && (
              <span className="text-xs text-gray-500">
                Showing 3 of {booking.monthlyPayments.length}
              </span>
            )}
          </div>

          {/* Monthly Payments Grid - Show 3 first, then all */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAllPayments
              ? booking.monthlyPayments
              : booking.monthlyPayments.slice(0, 3)
            ).map((payment, index) => {
              const isOverdue = isPaymentOverdue(
                payment.dueDate,
                payment.status,
                payment.paid
              );
              const statusColor = isOverdue
                ? "bg-red-50 border-red-200 text-red-800"
                : getPaymentStatusColor(payment.status, payment.paid);

              return (
                <motion.div
                  key={payment.month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`relative p-4 rounded-lg border-2 ${statusColor} hover:shadow-md transition-all duration-200`}
                >
                  {/* Month Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#b9a089] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {payment.month}
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm">
                          {formatMonthName(payment.month, booking.checkIn)}
                        </h5>
                        <p className="text-xs text-gray-500">
                          ₹{booking.monthlyRent}
                        </p>
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div className="flex items-center">
                      {isOverdue ? (
                        <XCircle className="text-red-500" size={18} />
                      ) : (
                        getPaymentStatusIcon(payment.status, payment.paid)
                      )}
                    </div>
                  </div>

                  {/* Payment Details */}

                  {/* Payment Details */}
                  <div className="space-y-2 text-xs">
                    {payment.month !== 1 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-medium">
                          {formatDate(payment.dueDate)}
                        </span>
                      </div>
                    )}

                    {payment.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid On:</span>
                        <span className="font-medium">
                          {formatDate(payment.paidAt)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`font-medium ${
                          isOverdue ? "text-red-600" : ""
                        }`}
                      >
                        {isOverdue
                          ? "Overdue"
                          : getPaymentStatusText(payment.status, payment.paid)}
                      </span>
                    </div>

                    {/* Reminder Status */}
                    {payment.reminderSent &&
                      !payment.paid &&
                      payment.status !== "completed" && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reminder:</span>
                          <span className="font-medium text-amber-600">
                            Sent
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Pay Now Button - Only show for pending payments with reminder sent */}
                  {!payment.paid &&
                    payment.status !== "completed" &&
                    payment.reminderSent && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handlePayNow(payment.month)}
                          disabled={isProcessingMonthlyPayment}
                          className="w-full bg-[#b9a089] hover:bg-[#a58e77] disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center"
                        >
                          {isProcessingMonthlyPayment ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="mr-1" size={14} />
                              Pay Now (₹{booking.monthlyRent})
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  {isOverdue && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Overdue
                    </div>
                  )}

                  {/* <div className="space-y-2 text-xs">
                    {payment.month !== 1 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-medium">
                          {formatDate(payment.dueDate)}
                        </span>
                      </div>
                    )}

                    {payment.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid On:</span>
                        <span className="font-medium">
                          {formatDate(payment.paidAt)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`font-medium ${
                          isOverdue ? "text-red-600" : ""
                        }`}
                      >
                        {isOverdue
                          ? "Overdue"
                          : getPaymentStatusText(payment.status, payment.paid)}
                      </span>
                    </div>
                  </div> */}

                  {/* Progress Indicator */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          payment.paid || payment.status === "completed"
                            ? "bg-green-500"
                            : isOverdue
                            ? "bg-red-500"
                            : "bg-amber-500"
                        }`}
                        style={{
                          width:
                            payment.paid || payment.status === "completed"
                              ? "100%"
                              : isOverdue
                              ? "100%"
                              : "60%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Overdue Badge */}
                  {isOverdue && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Overdue
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Show More/Show Less Button - Only show if more than 3 payments */}
          {booking.monthlyPayments.length > 3 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAllPayments(!showAllPayments)}
                className={`px-4 py-2 text-sm rounded-md transition-colors flex items-center mx-auto ${
                  showAllPayments
                    ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    : "bg-[#b9a089] text-white hover:bg-[#a58e77]"
                }`}
              >
                {showAllPayments ? (
                  <>
                    Show Less
                    <ChevronUp className="ml-2" size={16} />
                  </>
                ) : (
                  <>
                    Show More ({booking.monthlyPayments.length - 3} more)
                    <ChevronDown className="ml-2" size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Payment Summary */}
          <div className="mt-6 bg-gradient-to-r from-[#b9a089]/5 to-[#b9a089]/10 p-4 rounded-lg border border-[#b9a089]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="text-[#b9a089] mr-2" size={18} />
                <span className="font-medium text-gray-700">
                  Payment Summary
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Total: {paymentStats.total} months |
                  <span className="text-green-600 ml-1">
                    Paid: {paymentStats.paid}
                  </span>{" "}
                  |
                  <span className="text-amber-600 ml-1">
                    Pending: {paymentStats.pending}
                  </span>
                  {paymentStats.overdue > 0 && (
                    <span className="text-red-600 ml-1">
                      | Overdue: {paymentStats.overdue}
                    </span>
                  )}
                </p>
                <p className="text-lg font-bold text-[#b9a089] mt-1">
                  Total Amount: ₹{booking.monthlyRent * paymentStats.total}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
            hostelName: booking.hostelId.hostel_name,
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
                      ₹{getFacilityPrice(facility)}/month
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
                            ₹{facility.totalCost || "—"}
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
              ₹{calculateTotalFacilitiesCost(booking.selectedFacilities)}
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

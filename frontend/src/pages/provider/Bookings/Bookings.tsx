import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  User,
  FileCheck,
  Building,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  Utensils,
  WashingMachine,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import { useProviderBookings } from "@/hooks/provider/booking/useBooking";
import Loading from "@/components/global/Loading";

interface Facility {
  facilityId: {
    _id: string;
    name: string;
    description?: string;
    price?: number;
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
}

interface Booking {
  _id: string;
  hostelId: {
    _id: string;
    hostel_name: string;
    location: Location;
  };
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
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

export const Bookings = () => {
  const {
    data: bookings = [],
    isLoading,
    error,
    refetch,
  } = useProviderBookings();
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending">(
    "all"
  );
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(
    null
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 3;

  // Reset to first page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
    setExpandedBookingId(null);
  }, [activeTab]);

  const toggleBookingDetails = (bookingId: string) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 mt-4 max-w-6xl mx-auto flex items-center justify-center h-[600px]">
        <Loading text="loading bookings..." color="#FFB300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 mt-4 max-w-6xl mx-auto bg-white rounded-lg shadow-md h-[600px]">
        <div className="text-center text-red-500 py-10">
          <h3 className="text-xl font-medium">Error loading bookings</h3>
          <p className="mt-2">Please try again later</p>
          <button
            className="mt-4 bg-amber-400 hover:bg-amber-500 text-gray-800 px-4 py-2 rounded-md transition-colors"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(
    (booking: { paymentStatus: string }) => {
      if (activeTab === "all") return true;
      if (activeTab === "completed")
        return booking.paymentStatus === "completed";
      if (activeTab === "pending") return booking.paymentStatus === "pending";
      return true;
    }
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
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

  const calculateFacilityDuration = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Calculate difference in months
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

      return months > 0
        ? `${months} month${months > 1 ? "s" : ""}`
        : "Less than a month";
    } catch (error) {
      return "Duration unavailable";
    }
  };

  const getFacilityIcon = (facilityType: string) => {
    // Convert to lowercase for case-insensitive matching
    const type = facilityType.toLowerCase();

    if (type.includes("catering") || type.includes("food")) {
      return <Utensils className="text-amber-500 mr-2" size={16} />;
    } else if (type.includes("laundry") || type.includes("washing")) {
      return <WashingMachine className="text-amber-500 mr-2" size={16} />;
    } else if (type.includes("cleaning") || type.includes("clean")) {
      return <Briefcase className="text-amber-500 mr-2" size={16} />;
    } else {
      return <CheckCircle className="text-amber-500 mr-2" size={16} />;
    }
  };

  const getFacilityName = (facility: Facility) => {
    // Check if facilityId is populated as an object with name
    if (
      facility.facilityId &&
      typeof facility.facilityId === "object" &&
      facility.facilityId.name
    ) {
      return facility.facilityId.name;
    }
    // Otherwise use the type field as fallback
    return facility.type || "Unknown Facility";
  };

  const getFacilityDescription = (facility: Facility) => {
    if (
      facility.facilityId &&
      typeof facility.facilityId === "object" &&
      facility.facilityId.description
    ) {
      return facility.facilityId.description;
    }
    return null;
  };

  const getHostelName = (booking: Booking) => {
    return (
      booking.hostelId?.hostel_name ||
      `Hostel #${booking.hostelId?._id?.substring(0, 8) || "Unknown"}`
    );
  };

  const getHostelAddress = (booking: Booking) => {
    if (booking.hostelId?.location?.address) {
      return booking.hostelId.location.address;
    }
    return null;
  };

  // Go to previous page
  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
    setExpandedBookingId(null); // Close any expanded details when changing pages
  };

  // Go to next page
  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
    setExpandedBookingId(null); // Close any expanded details when changing pages
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3; // Show at most 3 page numbers at a time

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust start page if end page is maxed out
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="p-4 sm:p-8 mt-4 max-w-6xl mx-auto bg-white rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-dm_sans font-semibold text-gray-900 mb-6 border-b pb-2">
        Bookings Management
      </h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4 border-b">
        <button
          className={`pb-2 px-1 font-medium text-sm ${
            activeTab === "all"
              ? "text-amber-500 border-b-2 border-amber-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Bookings
        </button>
        <button
          className={`pb-2 px-1 font-medium text-sm ${
            activeTab === "completed"
              ? "text-amber-500 border-b-2 border-amber-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
        <button
          className={`pb-2 px-1 font-medium text-sm ${
            activeTab === "pending"
              ? "text-amber-500 border-b-2 border-amber-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-500">
            No bookings found
          </h3>
          <p className="mt-2 text-gray-400">
            No bookings match your current filter.
          </p>
        </div>
      ) : (
        <div className="h-full pr-2 custom-scrollbar flex flex-col justify-between">
          <div className="space-y-4">
            {currentBookings.map((booking: Booking) => (
              <div
                key={booking._id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Header with Booking Summary */}
                <div className="bg-gradient-to-r from-amber-50 to-white border-b px-4 py-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-amber-100 p-2 rounded-full mr-3">
                        <Building className="text-amber-600" size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">
                          {getHostelName(booking)}
                        </h3>
                        <div className="text-xs text-gray-500">
                          ID: #{booking._id.substring(booking._id.length - 8)}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        booking.paymentStatus
                      )}`}
                    >
                      {booking.paymentStatus.charAt(0).toUpperCase() +
                        booking.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Compact Summary - Horizontal Layout */}
                <div className="p-3 bg-white">
                  <div className="flex flex-wrap border-b border-gray-100 pb-3 mb-3">
                    {/* Customer Information */}
                    <div className="flex items-center px-3 py-1">
                      <User className="text-amber-500 mr-2" size={14} />
                      <div>
                        <div className="text-xs text-gray-500">Customer</div>
                        <div className="text-sm font-medium">
                          {booking.userId.fullName}
                        </div>
                      </div>
                    </div>

                    {/* Check-in Date */}
                    <div className="flex items-center px-3 py-1">
                      <Calendar className="text-amber-500 mr-2" size={14} />
                      <div>
                        <div className="text-xs text-gray-500">Check-in</div>
                        <div className="text-sm font-medium">
                          {formatDate(booking.checkIn)}
                        </div>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center px-3 py-1">
                      <Clock className="text-amber-500 mr-2" size={14} />
                      <div>
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className="text-sm font-medium">
                          {booking.stayDurationInMonths} months
                        </div>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="flex items-center px-3 py-1">
                      <CreditCard className="text-amber-500 mr-2" size={14} />
                      <div>
                        <div className="text-xs text-gray-500">
                          Total Amount
                        </div>
                        <div className="text-sm font-medium">
                          ₹{booking.totalPrice}
                        </div>
                      </div>
                    </div>

                    {/* Address (if available) */}
                    {getHostelAddress(booking) && (
                      <div className="flex items-center px-3 py-1">
                        <MapPin className="text-amber-500 mr-2" size={14} />
                        <div>
                          <div className="text-xs text-gray-500">Address</div>
                          <div className="text-sm font-medium truncate max-w-[200px]">
                            {getHostelAddress(booking)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Booked on: {formatDate(booking.bookingDate)}
                    </div>
                    <div className="flex gap-2">
                      {/* Contact Customer Button */}
                      <a
                        href={`mailto:${booking.userId.email}`}
                        className="flex items-center justify-center px-3 py-1 bg-green-50 hover:bg-green-100 rounded-md transition-colors text-xs font-medium text-green-600"
                      >
                        <Phone className="mr-1" size={14} />
                        Contact
                      </a>

                      {/* View Details Button */}
                      <button
                        onClick={() => toggleBookingDetails(booking._id)}
                        className="flex items-center justify-center px-3 py-1 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors text-xs font-medium text-amber-600"
                      >
                        {expandedBookingId === booking._id ? (
                          <>
                            Hide Details{" "}
                            <ChevronUp className="ml-1" size={14} />
                          </>
                        ) : (
                          <>
                            View Details{" "}
                            <ChevronDown className="ml-1" size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Booking Details */}
                {expandedBookingId === booking._id && (
                  <div className="border-t border-gray-100 bg-amber-50/30 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Information Section */}
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <User className="text-amber-500 mr-2" size={16} />
                          Customer Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <span className="text-gray-500 w-24 text-sm">
                              Name:
                            </span>
                            <span className="text-gray-800 text-sm font-medium">
                              {booking.userId.fullName}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 w-24 text-sm">
                              Email:
                            </span>
                            <span className="text-gray-800 text-sm font-medium">
                              {booking.userId.email}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 w-24 text-sm">
                              Phone:
                            </span>
                            <span className="text-gray-800 text-sm font-medium">
                              {booking.userId.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stay Information Section */}
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <Calendar className="text-amber-500 mr-2" size={16} />
                          Stay Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <span className="text-gray-500 w-24 text-sm">
                              Check-in:
                            </span>
                            <span className="text-gray-800 text-sm font-medium">
                              {formatDate(booking.checkIn)}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 w-24 text-sm">
                              Check-out:
                            </span>
                            <span className="text-gray-800 text-sm font-medium">
                              {formatDate(booking.checkOut)}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 w-24 text-sm">
                              Duration:
                            </span>
                            <span className="text-gray-800 text-sm font-medium">
                              {booking.stayDurationInMonths} months
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information Section */}
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <CreditCard
                            className="text-amber-500 mr-2"
                            size={16}
                          />
                          Payment Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <span className="text-gray-500 w-36 text-sm">
                              Monthly Rent:
                            </span>
                            <span className="text-gray-800 text-sm font-medium">
                              ₹{booking.monthlyRent}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 w-36 text-sm">
                              Deposit Amount:
                            </span>
                            <span className="text-gray-800 text-sm font-medium">
                              ₹{booking.depositAmount}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 w-36 text-sm">
                              First Month Payment:
                            </span>
                            <span className="text-gray-800 text-sm font-medium">
                              ₹{booking.firstMonthRent}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 w-36 text-sm">
                              Total Amount:
                            </span>
                            <span className="text-gray-800 text-sm font-medium">
                              ₹{booking.totalPrice}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 w-36 text-sm">
                              Payment Status:
                            </span>
                            <span
                              className={`text-sm font-medium px-2 py-0.5 rounded-full ${getStatusClass(
                                booking.paymentStatus
                              )}`}
                            >
                              {booking.paymentStatus.charAt(0).toUpperCase() +
                                booking.paymentStatus.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Selected Facilities Section */}
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <CookingPot
                            className="text-amber-500 mr-2"
                            size={16}
                          />
                          Selected Facilities
                        </h4>
                        {booking.selectedFacilities &&
                        booking.selectedFacilities.length > 0 ? (
                          <div className="space-y-3">
                            {booking.selectedFacilities.map(
                              (facility, index) => (
                                <div
                                  key={index}
                                  className="bg-amber-50 p-3 rounded-md"
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center">
                                      {getFacilityIcon(
                                        getFacilityName(facility)
                                      )}
                                      <span className="text-gray-800 text-sm font-medium">
                                        {getFacilityName(facility)}
                                      </span>
                                    </div>
                                    <span className="text-amber-600 text-sm font-medium">
                                      ₹{facility.totalCost}
                                    </span>
                                  </div>

                                  {getFacilityDescription(facility) && (
                                    <p className="text-gray-600 text-xs ml-7 mb-1">
                                      {getFacilityDescription(facility)}
                                    </p>
                                  )}

                                  <div className="ml-7 flex flex-wrap gap-x-4 text-xs text-gray-500">
                                    <div className="flex items-center">
                                      <Calendar className="mr-1 h-3 w-3" />
                                      <span>
                                        From: {formatDate(facility.startDate)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="mr-1 h-3 w-3" />
                                      <span>
                                        To: {formatDate(facility.endDate)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="mr-1 h-3 w-3" />
                                      <span>
                                        Duration:{" "}
                                        {calculateFacilityDuration(
                                          facility.startDate,
                                          facility.endDate
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <CreditCard className="mr-1 h-3 w-3" />
                                      <span>
                                        Rate: ₹{facility.ratePerMonth}/month
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm italic">
                            No additional facilities selected
                          </p>
                        )}
                      </div>

                      {/* Proof Document Section */}
                      <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <FileCheck
                            className="text-amber-500 mr-2"
                            size={16}
                          />
                          Documentation
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Proof Document:
                          </span>
                          <a
                            href={booking.proof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center bg-amber-50 text-amber-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-amber-100 transition-colors"
                          >
                            <FileCheck className="mr-2" size={14} />
                            View Document
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center items-center space-x-2 pt-3 border-t border-gray-200">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              {getPageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => {
                    setCurrentPage(pageNumber);
                    setExpandedBookingId(null);
                  }}
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                    currentPage === pageNumber
                      ? "bg-amber-400 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #b9a089;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a58e77;
          }
        `}
      </style>
    </div>
  );
};

export default Bookings;

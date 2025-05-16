import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Building,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useUserBookings } from "@/hooks/user/useUserQueries";
import Loading from "@/components/global/Loading";
import BookingDetails from "./components/BookingDetails";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface Facility {
  facilityId: {
    _id: string;
    name: string;
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

export const MyBookings = () => {
  const { data: bookingsData, isLoading, error, refetch } = useUserBookings();
  const [activeTab, setActiveTab] = useState<"all" | "Completed" | "pending">(
    "all"
  );
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 2;

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
        <Loading text="Loading bookings..." color="#b9a089" />
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
            className="mt-4 bg-[#b9a089] hover:bg-[#a58e77] text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Extract bookings from the API response structure
  const bookings: Booking[] = bookingsData || [];

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "Completed") return booking.paymentStatus === "completed";
    if (activeTab === "pending") return booking.paymentStatus === "pending";
    return true;
  });

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
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
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

  // const getFacilityName = (facility: Facility) => {
  //   // Check if facilityId is populated as an object with name
  //   if (facility.facilityId && typeof facility.facilityId === 'object' && facility.facilityId.name) {
  //     return facility.facilityId.name;
  //   }
  //   // Otherwise use the type field as fallback
  //   return facility.type || 'Unknown Facility';
  // };

  // const getFacilityPrice = (facility: Facility) => {
  //   return facility.ratePerMonth || 0;
  // };

  // const calculateTotalFacilitiesCost = (facilities: Facility[]) => {
  //   if (!facilities || !Array.isArray(facilities) || facilities.length === 0) return 0;
  //   return facilities.reduce((total, facility) => total + (facility.totalCost || 0), 0);
  // };

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

  // Go to specific page
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4 sm:p-8 mt-4 max-w-6xl mx-auto bg-white rounded-lg shadow-md h-[600px]"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-2xl font-dm_sans font-semibold text-gray-900 mb-6 border-b pb-2"
      >
        My Bookings
      </motion.h2>

      {/* Tabs with animations */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex space-x-4 mb-4 border-b"
      >
        {["all", "Completed", "pending"].map((tab, index) => (
          <motion.button
            key={tab}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`pb-2 px-1 font-medium text-sm ${
              activeTab === tab
                ? "text-[#b9a089] border-b-2 border-[#b9a089]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab as "all" | "Completed" | "pending")}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
            {tab === "all" ? "Bookings" : ""}
          </motion.button>
        ))}
      </motion.div>

      {/* Bookings List with animations */}
      {filteredBookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10"
        >
          <h3 className="text-xl font-medium text-gray-500">
            No bookings found
          </h3>
          <p className="mt-2 text-gray-400">
            You haven't made any bookings yet or no bookings match your filter.
          </p>
        </motion.div>
      ) : (
        <div className="h-[420px] overflow-y-auto pr-2 custom-scrollbar flex flex-col justify-between">
          <div className="space-y-4">
            <AnimatePresence>
              {currentBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {/* Compact Header with Summary Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    className="bg-gradient-to-r from-[#b9a089]/10 to-white border-b px-4 py-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-[#b9a089]/5 p-2 rounded-full mr-3">
                          <Building className="text-[#b9a089]" size={18} />
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
                  </motion.div>

                  {/* Compact Summary - Horizontal Layout */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="p-3 bg-white"
                  >
                    <div className="flex flex-wrap border-b border-gray-100 pb-3 mb-3">
                      <div className="flex items-center px-3 py-1">
                        <Calendar className="text-[#b9a089] mr-2" size={14} />
                        <div>
                          <div className="text-xs text-gray-500">Check-in</div>
                          <div className="text-sm font-medium">
                            {formatDate(booking.checkIn)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center px-3 py-1">
                        <Clock className="text-[#b9a089] mr-2" size={14} />
                        <div>
                          <div className="text-xs text-gray-500">Duration</div>
                          <div className="text-sm font-medium">
                            {booking.stayDurationInMonths} months
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center px-3 py-1">
                        <CreditCard className="text-[#b9a089] mr-2" size={14} />
                        <div>
                          <div className="text-xs text-gray-500">
                            Total Amount
                          </div>
                          <div className="text-sm font-medium">
                            ${booking.totalPrice}
                          </div>
                        </div>
                      </div>

                      {getHostelAddress(booking) && (
                        <div className="flex items-center px-3 py-1">
                          <MapPin className="text-[#b9a089] mr-2" size={14} />
                          <div>
                            <div className="text-xs text-gray-500">Address</div>
                            <div className="text-sm font-medium truncate max-w-[200px]">
                              {getHostelAddress(booking)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <motion.div
                      className="flex justify-between items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    >
                      <div className="text-xs text-gray-500">
                        Booked on: {formatDate(booking.bookingDate)}
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleBookingDetails(booking._id)}
                          className="flex items-center justify-center px-3 py-1 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors text-xs font-medium text-gray-600"
                        >
                          {expandedBookingId === booking._id ? (
                            <>
                              Hide Details{" "}
                              <ChevronUp className="ml-1" size={14} />
                            </>
                          ) : (
                            <>
                              Quick View{" "}
                              <ChevronDown className="ml-1" size={14} />
                            </>
                          )}
                        </motion.button>

                        <Link
                          to={`/user/bookings/${booking._id}`}
                          className="flex items-center justify-center px-3 py-1 bg-[#b9a089]/10 hover:bg-[#b9a089]/20 rounded-md transition-colors text-xs font-medium text-[#b9a089]"
                        >
                          <ExternalLink size={14} className="mr-1" />
                          Full Details
                        </Link>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Detailed View Component with animation */}
                  <AnimatePresence>
                    {expandedBookingId === booking._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <BookingDetails booking={booking} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination with animations */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 flex justify-center items-center space-x-2 pt-3 border-t border-gray-200"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={18} />
              </motion.button>

              {getPageNumbers().map((pageNumber) => (
                <motion.button
                  key={pageNumber}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => goToPage(pageNumber)}
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                    currentPage === pageNumber
                      ? "bg-[#b9a089] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          )}
        </div>
      )}

      <style>{`
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
      `}</style>
    </motion.div>
  );
};

export default MyBookings;

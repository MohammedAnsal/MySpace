import { useUserBookings } from "@/hooks/user/booking/useBooking";
import {
  Building2,
  UtensilsCrossed,
  Trash2,
  WashingMachine,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";

interface Facility {
  _id: string;
  type: string;
  facilityId: {
    _id: string;
  };
  duration: number;
  startDate: string;
  endDate: string;
  ratePerMonth: number;
  totalCost: number;
}

// interface Booking {
//   _id: string;
//   selectedFacilities: Facility[];
//   providerId: string;
//   hostelId: {
//     _id: string;
//     hostel_name: string;
//     location: {
//       address: string;
//     };
//   };
// }

// // Add this interface for the flattened facility
// interface FlattenedFacility extends Facility {
//   hostel: {
//     _id: string;
//     hostel_name: string;
//     location: {
//       address: string;
//     };
//   };
//   providerId: string;
// }

export const MyFacility = () => {
  const { data: bookings, isLoading } = useUserBookings();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const facilitiesPerPage = 2;

  const getFacilityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "catering service":
        return <UtensilsCrossed className="h-5 w-5 text-[#b9a089]" />;
      case "laundry service":
        return <WashingMachine className="h-5 w-5 text-[#b9a089]" />;
      case "deep cleaning service":
        return <Trash2 className="h-5 w-5 text-[#b9a089]" />;
      default:
        return <Building2 className="h-5 w-5 text-[#b9a089]" />;
    }
  };

  const handleViewFacility = (
    facility: Facility,
    hostelId: string,
    providerId: string
  ) => {
    switch (facility.type.toLowerCase()) {
      case "catering service":
        navigate(`/user/facility/food/${facility.facilityId._id}/${hostelId}`);
        break;
      case "laundry service":
        navigate(
          `/user/facility/washing/${facility.facilityId}/${hostelId}/${providerId}`
        );
        break;
      case "deep cleaning service":
        navigate(
          `/user/facility/cleaning/${facility.facilityId}/${hostelId}/${providerId}`
        );
        break;
      default:
        break;
    }
  };

  // // Update the flattening logic with proper typing
  // const allFacilities: FlattenedFacility[] = bookings
  //   ? bookings.flatMap((booking: Booking) =>
  //       booking.selectedFacilities.map((facility: Facility) => ({
  //         ...facility,
  //         hostel: booking.hostelId,
  //         providerId: booking.providerId,
  //       }))
  //     )
  //   : [];

  // Update the pagination logic to work with bookings instead of facilities
  const totalPages = Math.ceil((bookings?.length || 0) / facilitiesPerPage);
  const startIndex = (currentPage - 1) * facilitiesPerPage;
  const endIndex = startIndex + facilitiesPerPage;
  const paginatedBookings = bookings?.slice(startIndex, endIndex) || [];

  // Update the page info to show bookings count
  const totalBookings = bookings?.length || 0;

  // Navigation functions
  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  const facilityVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Always show header first
  return (
    <motion.div
      className="min-h-[600px] bg-gray-50 rounded-2xl overflow-hidden shadow-lg mt-4 max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header - Always visible */}
        <motion.div variants={cardVariants} className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-2 bg-[#f7f4f1] rounded-lg"
            >
              <Building2 className="h-6 w-6 text-[#b9a089]" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900">My Facilities</h1>
          </div>
          <p className="text-gray-600">
            View and manage your booked hostel facilities
          </p>
        </motion.div>

        {/* Conditional Content based on loading state */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-12 w-12 border-b-2 border-[#b9a089] mx-auto"
              />
              <p className="mt-4 text-gray-600">Loading facilities...</p>
            </div>
          </motion.div>
        ) : !bookings?.length ? (
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            className="text-center max-w-md mx-auto p-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="mx-auto w-16 h-16 bg-[#f7f4f1] rounded-full flex items-center justify-center mb-4"
            >
              <Building2 className="h-8 w-8 text-[#b9a089]" />
            </motion.div>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              No Hostel Bookings Found
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mb-6"
            >
              You haven't booked any hostels yet. Book a hostel to access its
              facilities.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div variants={facilityVariants} className="space-y-6">
            {/* Paginated Bookings */}
            {paginatedBookings.map(
              (
                booking: {
                  _id: Key | null | undefined;
                  hostelId: {
                    hostel_name:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | null
                      | undefined;
                    location: {
                      address:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | null
                        | undefined;
                    };
                    _id: string;
                  };
                  selectedFacilities: any[];
                  providerId: string;
                },
                bookingIndex: number
              ) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: bookingIndex * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  {/* Hostel Header */}
                  <motion.div
                    whileHover={{ backgroundColor: "#f7f4f1" }}
                    className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                          {booking.hostelId.hostel_name}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {booking.hostelId.location.address}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Facilities List */}
                  <div className="p-4 sm:p-6">
                    {booking.selectedFacilities &&
                    booking.selectedFacilities.length > 0 ? (
                      // Show existing facilities
                      booking.selectedFacilities.map(
                        (facility, facilityIndex) => (
                          <motion.div
                            key={facility._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: facilityIndex * 0.1 }}
                            className="flex items-center justify-between mb-4 last:mb-0"
                          >
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="p-1.5 sm:p-2 bg-white rounded-lg"
                              >
                                {getFacilityIcon(facility.type)}
                              </motion.div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-medium text-gray-900">
                                  {facility.type}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {facility.duration} months
                                </p>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleViewFacility(
                                  facility,
                                  booking.hostelId._id,
                                  booking.providerId
                                )
                              }
                              className="flex items-center justify-center p-2 bg-[#b9a089]/10 hover:bg-[#b9a089]/20 rounded-lg transition-colors"
                            >
                              <ChevronRight className="h-4 w-4 text-[#b9a089]" />
                            </motion.button>
                          </motion.div>
                        )
                      )
                    ) : (
                      // Show "No facilities" in the same list format
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="p-1.5 sm:p-2 bg-gray-100 rounded-lg"
                          >
                            <Building2 className="h-5 w-5 text-gray-400" />
                          </motion.div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500">
                              No facilities selected
                            </h4>
                            <p className="text-xs text-gray-400">
                              Add facilities to this booking
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            navigate(`/user/bookings/${booking._id}`)
                          }
                          className="flex items-center justify-center px-3 py-2 bg-[#b9a089] text-white rounded-lg hover:bg-[#a58e77] transition-colors text-xs sm:text-sm"
                        >
                          <Building2 className="h-4 w-4 mr-1" />
                          Select
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex justify-center items-center space-x-2 pt-4 border-t border-gray-200"
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

            {/* Page Info */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-sm text-gray-500"
              >
                Page {currentPage} of {totalPages} • {totalBookings} total
                bookings
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyFacility;

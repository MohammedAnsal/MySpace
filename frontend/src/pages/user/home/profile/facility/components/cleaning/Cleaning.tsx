import { useParams } from "react-router-dom";
import {
  PlusCircle,
  X,
  Loader2,
  CheckCircle2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  useUserCleaningRequests,
  useCancelCleaningRequest,
} from "@/hooks/user/facility/useFacility";
import BookingModal from "./BookingModal";
import { FaBroom } from "react-icons/fa";

const Cleaning = () => {
  const { facilityId, hostelId, providerId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  // Use react-query for data fetching
  const { data: cleaningRequestsData, isLoading: isLoadingRequests } =
    useUserCleaningRequests();

  // Use mutation hook for cancellation
  const cancelCleaningMutation = useCancelCleaningRequest();

  const userBookings = cleaningRequestsData?.data || [];

  const cancelRequest = async (id: string) => {
    cancelCleaningMutation.mutate(id, {
      onSuccess: (response) => {
        if (response && response.success) {
          toast.success("Request cancelled successfully");
        } else {
          toast.error(response?.message || "Failed to cancel request");
        }
      },
      onError: (error) => {
        console.error("Error cancelling request:", error);
        toast.error("Something went wrong. Please try again.");
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-[#b9a089]";
      case "In Progress":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Add pagination logic
  const totalPages = Math.ceil(userBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = userBookings.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-gray-50 py-8 rounded-2xl overflow-hidden shadow-lg mt-4 max-w-6xl mx-auto px-3 sm:px-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="p-3 bg-[#f8f5f2] rounded-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaBroom className="h-6 w-6 text-[#b9a089]" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Cleaning Facility
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Schedule professional cleaning services
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 rounded-lg transition-colors bg-[#b9a089] text-white hover:bg-[#a89079]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Book Cleaning
              </motion.button>
            </div>

            {/* About the service */}
            <motion.div
              className="bg-[#f8f5f2] rounded-lg p-4 border border-[#f0ebe6]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h3 className="font-medium text-[#8a7766] mb-2">
                About Cleaning Service
              </h3>
              <p className="text-sm text-[#8a7766]">
                Our professional cleaning services keep your living space
                spotless and hygienic. Services include dusting, vacuuming,
                bathroom cleaning, and general tidying up.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* User Bookings */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Cleaning Bookings
            </h2>

            {isLoadingRequests ? (
              <div className="flex justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loader2 className="h-8 w-8 text-[#b9a089]" />
                </motion.div>
              </div>
            ) : userBookings.length === 0 ? (
              <div className="text-center py-12">
                <motion.div
                  className="mx-auto w-16 h-16 mb-4 text-gray-300"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaBroom className="w-full h-full" />
                </motion.div>
                <p className="text-gray-500 text-lg">
                  You don't have any cleaning bookings yet.
                </p>
                {/* <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-[#b9a089] hover:text-[#a89079] font-medium text-sm underline"
                >
                  Create your first booking
                </button> */}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {currentBookings.map(
                    (
                      booking: {
                        _id: Key | null | undefined;
                        status:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | null
                          | undefined;
                        requestedDate: string | number | Date;
                        preferredTimeSlot:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | null
                          | undefined;
                        specialInstructions:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | null
                          | undefined;
                        createdAt?: string | Date;
                      },
                      index: number
                    ) => {
                      // Convert booking status to string for consistency
                      const status = String(booking.status);
                      const bookingDate = new Date(booking.requestedDate);
                      const isUpcoming = bookingDate > new Date();

                      return (
                        <motion.div
                          key={booking._id}
                          className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                            status === "Cancelled" ? "opacity-70" : ""
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.05,
                            duration: 0.3,
                          }}
                          whileHover={{ y: -4 }}
                        >
                          <div
                            className={`h-2 w-full ${getStatusColor(status)}`}
                          />

                          <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                                      status === "Pending"
                                        ? "bg-[#f8f5f2] text-[#8a7766]"
                                        : status === "In Progress"
                                        ? "bg-blue-100 text-blue-800"
                                        : status === "Completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {status}
                                  </span>
                                  {isUpcoming && (
                                    <span className="text-xs text-[#b9a089] font-medium">
                                      Upcoming
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mt-1">
                                  {bookingDate.toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </h3>
                              </div>

                              <div className="flex items-center">
                                {status === "Completed" && (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                )}
                              </div>
                            </div>

                            <div className="flex items-center mt-3 mb-4 text-sm text-gray-500">
                              <CalendarClock className="h-4 w-4 mr-1 text-[#b9a089]" />
                              <span>{booking.preferredTimeSlot}</span>
                            </div>

                            {booking.specialInstructions && (
                              <div className="mt-3 bg-[#f8f5f2] p-3 rounded-lg">
                                <p className="text-sm text-[#8a7766] italic">
                                  "{booking.specialInstructions}"
                                </p>
                              </div>
                            )}

                            {status === "Pending" && (
                              <motion.button
                                onClick={() =>
                                  cancelRequest(String(booking._id))
                                }
                                disabled={cancelCleaningMutation.isPending}
                                className="w-full mt-4 flex items-center justify-center py-2 border border-red-200 bg-white hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {cancelCleaningMutation.isPending &&
                                cancelCleaningMutation.variables ===
                                  booking._id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <X className="w-4 h-4 mr-2" /> Cancel
                                    Request
                                  </>
                                )}
                              </motion.button>
                            )}

                            {/* Show booking time if available */}
                            {booking.createdAt && (
                              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                                Booked on{" "}
                                {new Date(
                                  booking.createdAt
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    }
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            facilityId={facilityId}
            providerId={String(providerId)}
            hostelId={hostelId}
            onSuccess={() => {}} // React Query will handle refetching
          />
        )}
      </AnimatePresence>

      {/* Pagination component */}
      {userBookings.length > 0 && (
        <motion.div
          className="flex flex-col items-center mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {/* Pagination controls */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${
                currentPage === 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-[#b9a089] text-[#b9a089] hover:bg-[#f8f5f2]"
              }`}
              whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
              whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            {/* Page numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate the page number to display
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  const startPage = Math.max(1, currentPage - 2);
                  const endPage = Math.min(totalPages, startPage + 4);

                  if (endPage - startPage < 4) {
                    pageNum = Math.max(1, totalPages - 4) + i;
                  } else {
                    pageNum = startPage + i;
                  }
                }

                return (
                  <motion.button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? "bg-[#b9a089] text-white"
                        : "text-gray-700 hover:bg-[#f8f5f2]"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}

              {/* Show ellipsis if there are more pages */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="w-8 h-8 flex items-center justify-center text-gray-500">
                  ...
                </span>
              )}

              {/* Show last page if not visible */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <motion.button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-gray-700 hover:bg-[#f8f5f2]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {totalPages}
                </motion.button>
              )}
            </div>

            <motion.button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${
                currentPage === totalPages
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-[#b9a089] text-[#b9a089] hover:bg-[#f8f5f2]"
              }`}
              whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
              whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Results counter */}
          <div className="text-sm text-gray-500 mt-3">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, userBookings.length)} of{" "}
            {userBookings.length} results
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cleaning;

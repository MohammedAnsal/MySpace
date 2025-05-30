import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  WashingMachine,
  Check,
  Loader2,
  Filter,
  RefreshCw,
  XCircle,
  Calendar,
  Package,
  AlarmClock,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { format, isToday, isPast, isFuture, parseISO } from "date-fns";
import {
  useProviderWashingRequests,
  useUpdateWashingStatus,
} from "@/hooks/provider/facility/useFacility";

export const Washing = () => {
  const { hostelId } = useParams();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  // Provider theme color
  const PROVIDER_COLOR = "orange";
  const PROVIDER_LIGHT = "orange-50";
  const PROVIDER_MEDIUM = "orange-100";
  const PROVIDER_DARK = "orange-500";
  const PROVIDER_DARKER = "orange-600";

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Increased to show more items per page

  // Get washing requests
  const { data: washingRequests = [], isLoading } =
    useProviderWashingRequests();

  // Update status mutation
  const updateStatusMutation = useUpdateWashingStatus();

  // Filter washing requests by hostel if hostelId is provided
  const filteredRequests = washingRequests
    .filter((request) => {
      // Filter by hostel if hostelId is provided
      if (hostelId && request.hostelId._id !== hostelId) return false;

      // Filter by status if selected
      if (selectedStatus && request.status !== selectedStatus) return false;

      // Filter by search term (customer name, email, or hostel name)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          request.userId.fullName.toLowerCase().includes(term) ||
          request.userId.email.toLowerCase().includes(term) ||
          request.hostelId.hostel_name.toLowerCase().includes(term)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by date (closest first) and then by status priority: Pending > In Progress > Completed > Cancelled
      const statusPriority = {
        Pending: 0,
        "In Progress": 1,
        Completed: 2,
        Cancelled: 3,
      };

      const dateA = new Date(a.requestedDate).getTime();
      const dateB = new Date(b.requestedDate).getTime();

      if (dateA === dateB) {
        return statusPriority[a.status] - statusPriority[b.status];
      }

      return dateA - dateB;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page changes
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Reset pagination when filters change
  const handleFilterChange = (status: string | null) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle updating status
  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: (response) => {
          if (response && response.status === "success") {
            toast.success(`Request status updated to ${newStatus}`);
          } else {
            toast.error(response?.message || "Failed to update status");
          }
        },
        onError: () => {
          toast.error("Something went wrong. Please try again.");
        },
      }
    );
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-wrap items-center justify-center space-x-2 mt-6">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : `text-${PROVIDER_DARK} hover:bg-${PROVIDER_LIGHT}`
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className={`px-3 py-1 rounded-md hover:bg-${PROVIDER_LIGHT} text-gray-700`}
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => goToPage(number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === number
                ? `bg-${PROVIDER_DARK} text-white`
                : `hover:bg-${PROVIDER_LIGHT} text-gray-700`
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-gray-500">...</span>
            )}
            <button
              onClick={() => goToPage(totalPages)}
              className={`px-3 py-1 rounded-md hover:bg-${PROVIDER_LIGHT} text-gray-700`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : `text-${PROVIDER_DARK} hover:bg-${PROVIDER_LIGHT}`
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  // Get request status details with color and icon
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          icon: <Calendar className="h-4 w-4" />,
          label: "Pending",
          bgColor: `bg-${PROVIDER_LIGHT}`,
          textColor: `text-${PROVIDER_DARKER}`,
          buttonColor: `bg-${PROVIDER_DARK} hover:bg-${PROVIDER_DARKER}`,
        };
      case "In Progress":
        return {
          icon: <RefreshCw className="h-4 w-4" />,
          label: "In Progress",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          buttonColor: "bg-blue-500 hover:bg-blue-600",
        };
      case "Completed":
        return {
          icon: <Check className="h-4 w-4" />,
          label: "Completed",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          buttonColor: "bg-green-500 hover:bg-green-600",
        };
      case "Cancelled":
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: "Cancelled",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          buttonColor: "bg-red-500 hover:bg-red-600",
        };
      default:
        return {
          icon: <Calendar className="h-4 w-4" />,
          label: status,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          buttonColor: "bg-gray-500 hover:bg-gray-600",
        };
    }
  };

  // Render date badge with appropriate styling
  const renderDateBadge = (date: string) => {
    const requestDate = parseISO(date);
    let badgeClass = "";
    let label = "";

    if (isPast(requestDate) && !isToday(requestDate)) {
      badgeClass = "bg-red-100 text-red-800";
      label = "Past";
    } else if (isToday(requestDate)) {
      badgeClass = "bg-green-100 text-green-800";
      label = "Today";
    } else if (isFuture(requestDate)) {
      badgeClass = "bg-blue-100 text-blue-800";
      label = "Upcoming";
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeClass}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className={`bg-${PROVIDER_LIGHT} p-3 rounded-lg mr-4`}>
              <WashingMachine className={`h-6 w-6 text-${PROVIDER_DARK}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Washing Service Management
              </h1>
              <p className="text-gray-600">
                Manage laundry service requests from your customers
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search customer or hostel..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${PROVIDER_DARK} focus:border-${PROVIDER_DARK} w-full`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 w-full sm:w-auto justify-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                {selectedStatus || "Filter by Status"}
                <svg
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isStatusMenuOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleFilterChange(null);
                        setIsStatusMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      All Statuses
                    </button>
                    {["Pending", "In Progress", "Completed", "Cancelled"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => {
                            handleFilterChange(status);
                            setIsStatusMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {["Pending", "In Progress", "Completed", "Cancelled"].map(
            (status) => {
              const count = washingRequests.filter(
                (r) => r.status === status
              ).length;
              const details = getStatusDetails(status);

              return (
                <div
                  key={status}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4"
                >
                  <div className="flex items-center">
                    <div
                      className={`${
                        status === "Pending" ? `bg-${PROVIDER_LIGHT}` : details.bgColor
                      } p-2 sm:p-3 rounded-full mr-3 sm:mr-4`}
                    >
                      {status === "Pending" ? (
                        <Calendar className={`h-4 w-4 text-${PROVIDER_DARK}`} />
                      ) : (
                        details.icon
                      )}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">{status}</p>
                      <p className="text-xl sm:text-2xl font-bold">{count}</p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Requests list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Washing Requests
              </h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center">
                  <Loader2 className={`h-8 w-8 text-${PROVIDER_DARK} animate-spin`} />
                  <p className="mt-2 text-gray-500">Loading requests...</p>
                </div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <WashingMachine className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No washing requests found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm || selectedStatus
                    ? "Try adjusting your filters to see more results."
                    : "When customers book laundry services, they will appear here."}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 sm:space-y-6">
                  <AnimatePresence>
                    {currentItems.map((request) => {
                      const statusDetails = getStatusDetails(request.status);
                      const isPending = request.status === "Pending";
                      const isInProgress = request.status === "In Progress";
                      const requestDate = parseISO(request.requestedDate);

  return (
                        <motion.div
                          key={request._id}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            className={`h-1 ${
                              isPending
                                ? `bg-${PROVIDER_DARK}`
                                : statusDetails.buttonColor
                            }`}
                          ></div>
                          <div className="p-4 sm:p-5">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                              <div>
                                <div className="flex items-center mb-1 flex-wrap gap-2">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                      isPending
                                        ? `bg-${PROVIDER_LIGHT} text-${PROVIDER_DARKER}`
                                        : `${statusDetails.bgColor} ${statusDetails.textColor}`
                                    }`}
                                  >
                                    {isPending ? (
                                      <Calendar className="h-3 w-3 mr-1" />
                                    ) : (
                                      statusDetails.icon
                                    )}
                                    <span className="ml-1">
                                      {request.status}
                                    </span>
                                  </span>
                                  {renderDateBadge(request.requestedDate)}
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                  {request.userId.fullName}
                                </h3>
                                <p className="text-gray-500 text-xs sm:text-sm truncate max-w-[240px] sm:max-w-full">
                                  {request.userId.email}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {isPending && (
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        request._id,
                                        "In Progress"
                                      )
                                    }
                                    className={`inline-flex items-center px-3 py-1.5 bg-${PROVIDER_DARK} text-white rounded-md hover:bg-${PROVIDER_DARKER} transition-colors text-sm font-medium`}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    {updateStatusMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <Check className="h-4 w-4 mr-2" />
                                    )}
                                    Accept
                                  </button>
                                )}

                                {isInProgress && (
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        request._id,
                                        "Completed"
                                      )
                                    }
                                    className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    {updateStatusMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <Check className="h-4 w-4 mr-2" />
                                    )}
                                    Complete
                                  </button>
                                )}

                                {(isPending || isInProgress) && (
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        request._id,
                                        "Cancelled"
                                      )
                                    }
                                    className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    {updateStatusMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <XCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                              <div className="flex items-start">
                                <Calendar className={`h-4 w-4 sm:h-5 sm:w-5 text-${PROVIDER_DARK} mt-0.5 mr-2`} />
                                <div>
                                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                                    Requested Date
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    {format(requestDate, "PPP")}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start">
                                <AlarmClock className={`h-4 w-4 sm:h-5 sm:w-5 text-${PROVIDER_DARK} mt-0.5 mr-2`} />
                                <div>
                                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                                    Time Slot
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    {request.preferredTimeSlot}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start">
                                <Package className={`h-4 w-4 sm:h-5 sm:w-5 text-${PROVIDER_DARK} mt-0.5 mr-2`} />
                                <div>
                                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                                    Items
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    {request.itemsCount}{" "}
                                    {request.itemsCount === 1
                                      ? "item"
                                      : "items"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {request.specialInstructions && (
                              <div className={`mt-3 sm:mt-4 p-2 sm:p-3 bg-${PROVIDER_LIGHT} rounded-lg border border-${PROVIDER_MEDIUM}`}>
                                <div className="flex items-start">
                                  <MessageSquare className={`h-4 w-4 sm:h-5 sm:w-5 text-${PROVIDER_DARK} mt-0.5 mr-2`} />
                                  <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                                      Special Instructions
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                      {request.specialInstructions}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div className="text-xs sm:text-sm text-gray-500">
                                  <span className="font-medium text-gray-700">
                                    Hostel:
                                  </span>{" "}
                                  {request.hostelId.hostel_name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Booked on{" "}
                                  {format(parseISO(request.createdAt), "PP")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Show pagination */}
                <Pagination />

                {/* Results summary */}
                <div className="text-xs text-gray-500 text-center mt-4">
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredRequests.length)} of{" "}
                  {filteredRequests.length} results
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

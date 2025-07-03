import { useUserBookings } from "@/hooks/user/booking/useBooking";
import {
  Building2,
  UtensilsCrossed,
  Trash2,
  WashingMachine,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Facility {
  _id: string;
  type: string;
  facilityId: {
    _id : string
  };
  duration: number;
  startDate: string;
  endDate: string;
  ratePerMonth: number;
  totalCost: number;
}

interface Booking {
  _id: string;
  selectedFacilities: Facility[];
  providerId: string;
  hostelId: {
    _id: string;
    hostel_name: string;
    location: {
      address: string;
    };
  };
}

export const MyFacility = () => {
  const { data: bookings, isLoading } = useUserBookings();
  const navigate = useNavigate();

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
            {bookings.map((booking: Booking, index: number) => (
              <motion.div
                key={booking._id}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
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

                {/* Facilities Grid */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">
                    Available Facilities
                  </h3>
                  {booking.selectedFacilities.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                        }}
                        className="mx-auto w-12 h-12 bg-[#f7f4f1] rounded-full flex items-center justify-center mb-3"
                      >
                        <UtensilsCrossed className="h-6 w-6 text-[#b9a089]" />
                      </motion.div>
                      <h4 className="text-base font-medium text-gray-900 mb-2">
                        No Facilities Selected
                      </h4>
                      <p className="text-sm text-gray-600">
                        You haven't selected any facilities for this hostel yet.
                        Click on the facilities to start using them.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {booking.selectedFacilities.map(
                        (facility, facilityIndex) => (
                          <motion.div
                            key={facility._id}
                            variants={facilityVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: facilityIndex * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() =>
                              handleViewFacility(
                                facility,
                                booking.hostelId._id,
                                booking.providerId
                              )
                            }
                          >
                            <div className="flex items-center justify-between">
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
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

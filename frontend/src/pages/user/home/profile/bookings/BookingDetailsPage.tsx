import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  useUserBookingsDetails,
  useCancelBooking,
  useReprocessBookingPayment,
  useFacilityPayment,
} from "@/hooks/user/booking/useBooking";
import BookingDetails from "./components/BookingDetails";
import { ArrowLeft, CreditCard, XCircle, Loader2 } from "lucide-react";
import Loading from "@/components/global/Loading";
import { motion } from "framer-motion";
import CancelBookingModal from "./components/CancelBookingModal";
import { toast } from "sonner";
import BuyFacilityModal from "./components/BuyFacilityModal";

const BookingDetailsPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();

  if (!bookingId) {
    return toast.error("BookingId not valid!");
  }

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const facilityPayment = params.get("facilityPayment");

    if (facilityPayment === "success") {
      toast.success("Facility purchase successful!");
      // Remove the query param from the URL after showing the toast
      navigate(location.pathname, { replace: true });
    } else if (facilityPayment === "cancel") {
      toast.error("Facility purchase was cancelled or failed.");
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const {
    data: booking,
    isLoading,
    error,
    refetch,
  } = useUserBookingsDetails(bookingId);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isBuyFacilityOpen, setIsBuyFacilityOpen] = useState(false);

  // Use the new hooks
  const { mutate: cancelBookingMutation, isPending: isCancelling } =
    useCancelBooking();
  const { mutate: reprocessPaymentMutation, isPending: isProcessingPayment } =
    useReprocessBookingPayment();
  const { mutate: startFacilityPayment } = useFacilityPayment();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  const handleBack = () => {
    navigate("/user/bookings");
  };

  const handleReprocessPayment = () => {
    if (!booking || !bookingId) return;

    reprocessPaymentMutation(bookingId, {
      onSuccess: (response) => {
        if (response?.data?.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
          console.log(response.data.checkoutUrl,'pppppppp')
          toast.success("Facilities added successfully!");
        } else {
          toast.error("Payment session creation failed");
        }
      },
      onError: (error) => {
        console.error("Payment processing error:", error);
        toast.error("Failed to process payment. Please try again later.");
      },
    });
  };

  const handleSubmitCancellation = async (reason: string) => {
    if (!booking || !bookingId) return;

    cancelBookingMutation(
      { bookingId, reason },
      {
        onSuccess: () => {
          refetch();
          navigate("/user/bookings");
        },
        onError: (error) => {
          console.error("Cancellation error:", error);
          toast.error("Failed to cancel booking");
        },
      }
    );
  };

  const handleBuyFacility = (
    selectedFacilities: { id: string; startDate: string; duration: number }[]
  ) => {
    startFacilityPayment(
      { bookingId: booking._id, facilities: selectedFacilities },
      {
        onSuccess: (data) => {
          if (data?.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            toast.error("Failed to start payment session");
          }
        },
        onError: () => {
          toast.error("Failed to start payment session");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center h-[600px]">
        <Loading text="Loading booking details..." />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-8 max-w-6xl mx-auto bg-white rounded-lg shadow-md h-[600px]">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Bookings
        </button>

        <div className="text-center text-red-500 py-10">
          <h3 className="text-xl font-medium">Booking not found</h3>
          <p className="mt-2">
            The booking you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
        </div>
      </div>
    );
  }

  const hostelFacilities = booking.hostelId.facilities || [];
  const hasAvailableFacilities =
    Array.isArray(hostelFacilities) && hostelFacilities.length > 0;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-8 mt-4 max-w-6xl mx-auto bg-white rounded-lg shadow-md"
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Bookings
        </button>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.paymentStatus === "completed"
              ? "bg-green-100 text-green-800"
              : booking.paymentStatus === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {booking.paymentStatus.charAt(0).toUpperCase() +
            booking.paymentStatus.slice(1)}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {booking.hostelId.hostel_name}
      </h1>

      <p className="text-sm text-gray-500 mb-6">Booking ID: #{booking._id}</p>

      {/* Main booking details */}
      <motion.div
        variants={cardVariants}
        className="border rounded-lg overflow-hidden mb-8"
      >
        <BookingDetails booking={booking} />
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-end gap-4"
      >
        {booking.paymentStatus === "pending" && (
          <button
            onClick={handleReprocessPayment}
            disabled={isProcessingPayment}
            className="flex items-center justify-center px-6 py-3 bg-[#b9a089] hover:bg-[#a58e77] text-white rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2" size={18} />
                Complete Payment
              </>
            )}
          </button>
        )}

        {booking.paymentStatus === "completed" && (
          <button
            onClick={() => setIsCancelModalOpen(true)}
            disabled={isCancelling}
            className="flex items-center justify-center px-6 py-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors disabled:opacity-50"
          >
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="mr-2" size={18} />
                Cancel Booking
              </>
            )}
          </button>
        )}

        {booking.selectedFacilities.length === 0 &&
          hasAvailableFacilities &&
          booking.paymentStatus === "completed" && (
            <button
              onClick={() => setIsBuyFacilityOpen(true)}
              className="px-4 py-2 bg-[#b9a089] text-white rounded-md"
            >
              Buy Facility
            </button>
          )}
      </motion.div>

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        bookingId={booking._id}
        onSubmit={handleSubmitCancellation}
      />

      <BuyFacilityModal
        isOpen={isBuyFacilityOpen}
        onClose={() => setIsBuyFacilityOpen(false)}
        hostelFacilities={hostelFacilities}
        checkIn={booking.checkIn}
        checkOut={booking.checkOut}
        onSubmit={handleBuyFacility}
      />
    </motion.div>
  );
};

export default BookingDetailsPage;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserBookingsDetails } from "@/hooks/user/booking/useBooking";
import BookingDetails from "./components/BookingDetails";
import { ArrowLeft, CreditCard, XCircle, Loader2 } from "lucide-react";
import Loading from "@/components/global/loading";
import { motion } from "framer-motion";
import CancelBookingModal from "./components/CancelBookingModal";
import { reprocessBookingPayment, cancelBooking } from "@/services/Api/userApi";
import { toast } from "sonner";

const BookingDetailsPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();

  if (!bookingId) {
    return toast.error("BookingId not valid!");
  }
  const navigate = useNavigate();
  const {
    data: booking,
    isLoading,
    error,
    refetch,
  } = useUserBookingsDetails(bookingId);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

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

  const handleReprocessPayment = async () => {
    if (!booking || !bookingId) return;

    try {
      setIsProcessingPayment(true);

      // Use the updated API function with bookingId
      const response = await reprocessBookingPayment(bookingId);

      if (response?.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error("Payment session creation failed");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Failed to process payment. Please try again later.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSubmitCancellation = async (reason: string) => {
    if (!booking || !bookingId) return;

    try {
      await cancelBooking(bookingId, reason);

      refetch(); // Refresh the bookings data
      navigate("/user/bookings");
      return Promise.resolve();
    } catch (error) {
      console.error("Cancellation error:", error);
      return Promise.reject(error);
    }
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

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-8 max-w-6xl mx-auto bg-white rounded-lg shadow-md"
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
            className="flex items-center justify-center px-6 py-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors"
          >
            <XCircle className="mr-2" size={18} />
            Cancel Booking
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
    </motion.div>
  );
};

export default BookingDetailsPage;

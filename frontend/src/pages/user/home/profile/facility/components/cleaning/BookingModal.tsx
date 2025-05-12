import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useCreateCleaningRequest } from "@/hooks/user/useUserQueries";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityId?: string;
  hostelId?: string;
  providerId?: string;
  onSuccess: () => void;
}

const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];

const BookingModal = ({
  isOpen,
  onClose,
  facilityId,
  hostelId,
  providerId,
  onSuccess,
}: BookingModalProps) => {
  const [requestDate, setRequestDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [instructions, setInstructions] = useState("");

  // Use mutation hook
  const createCleaningMutation = useCreateCleaningRequest();

  // Calculate min date (tomorrow)
  const tomorrow = addDays(new Date(), 1);
  const minDate = format(tomorrow, "yyyy-MM-dd");

  const resetForm = () => {
    setRequestDate("");
    setTimeSlot("");
    setInstructions("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!facilityId || !hostelId) {
      toast.error("Missing facility or hostel information");
      return;
    }

    createCleaningMutation.mutate(
      {
        providerId: providerId || "",
        hostelId: hostelId || "",
        facilityId: facilityId || "",
        requestedDate: requestDate || "",
        preferredTimeSlot: timeSlot || "",
        specialInstructions: instructions,
      },
      {
        onSuccess: (response) => {
          if (response && response.success) {
            toast.success(
              response.message || "Cleaning request created successfully"
            );
            onClose();
            resetForm();
            onSuccess();
          } else {
            toast.error(response?.message || "Failed to create request");
          }
        },
        onError: (error) => {
          console.error("Error creating cleaning request:", error);
          toast.error("Something went wrong. Please try again.");
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <motion.h2
          className="text-xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Book Cleaning Service
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              min={minDate}
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a089] focus:border-[#b9a089]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Slot
            </label>
            <select
              required
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a089] focus:border-[#b9a089]"
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a089] focus:border-[#b9a089]"
              placeholder="Any special requirements..."
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={createCleaningMutation.isPending}
            className="w-full bg-[#b9a089] text-white py-2 px-4 rounded-lg hover:bg-[#a89079] flex items-center justify-center disabled:bg-[#b9a089] disabled:opacity-70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {createCleaningMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Book Now"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingModal;

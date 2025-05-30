import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useCreateWashingRequest } from "@/hooks/user/facility/useFacility";

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
  const [itemsCount, setItemsCount] = useState(1);
  const [instructions, setInstructions] = useState("");

  // Use mutation hook
  const createWashingMutation = useCreateWashingRequest();

  const tomorrow = addDays(new Date(), 1);
  const minDate = format(tomorrow, "yyyy-MM-dd");

  const resetForm = () => {
    setRequestDate("");
    setTimeSlot("");
    setItemsCount(1);
    setInstructions("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!facilityId || !hostelId) {
      toast.error("Missing facility or hostel information");
      return;
    }

    createWashingMutation.mutate(
      {
        providerId: providerId || "",
        hostelId: hostelId || "",
        facilityId: facilityId || "",
        requestedDate: requestDate || "",
        preferredTimeSlot: timeSlot || "",
        itemsCount: itemsCount || 0,
        specialInstructions: instructions,
      },
      {
        onSuccess: (response) => {
          if (response && response.status == "success") {
            toast.success(
              response.message || "Washing request created successfully"
            );
            onClose();
            resetForm();
            onSuccess();
          } else {
            toast.error(response?.message || "Failed to create request");
          }
        },
        onError: (error) => {
          console.error("Error creating washing request:", error);
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
          Book Washing Service
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a89079] focus:border-[#a89079]"
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a89079] focus:border-[#a89079]"
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
            transition={{ delay: 0.25 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Items
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                {[1, 3, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setItemsCount(num)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      itemsCount === num
                        ? "bg-[#a89079] text-white shadow-md"
                        : "bg-[#a89079]/10 text-[#a89079] hover:bg-[#a89079]/20"
                    }`}
                  >
                    {num} {num === 1 ? "item" : "items"}
                  </button>
                ))}
              </div>
              <div className="flex items-center bg-gray-50 rounded-xl p-2">
                <button
                  type="button"
                  onClick={() =>
                    itemsCount > 1 && setItemsCount(itemsCount - 1)
                  }
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    itemsCount > 1
                      ? "bg-[#a89079] text-white hover:bg-[#a89079]/90"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="flex-1 px-4">
                  <input
                    type="number"
                    value={itemsCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1) {
                        setItemsCount(value);
                      }
                    }}
                    className="w-full bg-white text-center py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#a89079] focus:border-[#a89079]"
                    min="1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setItemsCount(itemsCount + 1)}
                  className="w-9 h-9 rounded-lg bg-[#a89079] text-white hover:bg-[#a89079]/90 flex items-center justify-center transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a89079] focus:border-[#a89079]"
              placeholder="Any special requirements..."
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={createWashingMutation.isPending}
            className="w-full bg-[#a89079] text-white py-2 px-4 rounded-lg hover:bg-[#ac9681] flex items-center justify-center disabled:bg-[#a89079]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0 }}
          >
            {createWashingMutation.isPending ? (
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

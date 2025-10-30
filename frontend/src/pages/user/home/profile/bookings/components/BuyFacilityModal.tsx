import React, { useState } from "react";
import { toast } from "sonner";
import { addMonths, isBefore, isAfter, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Facility = {
  _id: string;
  name: string;
  price: number;
};

type SelectedFacility = {
  id: string;
  name: string;
  startDate: string; 
  duration: number;
};

interface BuyFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostelFacilities: Facility[];
  checkIn: string;
  checkOut: string;
  onSubmit: (facilities: SelectedFacility[]) => Promise<void> | void;
}

const BuyFacilityModal: React.FC<BuyFacilityModalProps> = ({
  isOpen,
  onClose,
  hostelFacilities,
  checkIn,
  checkOut,
  onSubmit,
}) => {
  const [selectedFacilities, setSelectedFacilities] = useState<
    SelectedFacility[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Helper: get max duration for a facility based on startDate and checkOut
  const getMaxDuration = (startDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(checkOut);
    // If start is before checkIn, force it to checkIn
    const realStart = isBefore(start, parseISO(checkIn))
      ? parseISO(checkIn)
      : start;
    let months = 0;
    let temp = new Date(realStart);
    while (isBefore(temp, end)) {
      months++;
      temp = addMonths(temp, 1);
    }
    return months > 0 ? months : 1;
  };

  const handleToggle = (facility: Facility) => {
    const exists = selectedFacilities.find((f) => f.id === facility._id);
    if (exists) {
      setSelectedFacilities(
        selectedFacilities.filter((f) => f.id !== facility._id)
      );
    } else {
      const today = new Date();
      const checkInDate = parseISO(checkIn);
      const defaultStart = today > checkInDate ? today : checkInDate;
      setSelectedFacilities([
        ...selectedFacilities,
        {
          id: facility._id,
          name: facility.name,
          startDate: defaultStart.toISOString().slice(0, 10),
          duration: 1,
        },
      ]);
    }
  };

  // Handle start date change
  const handleDateChange = (facilityId: string, date: string) => {
    setSelectedFacilities((prev) =>
      prev.map((f) =>
        f.id === facilityId
          ? {
              ...f,
              startDate: date,
              // Reset duration if new max is less than current
              duration: Math.min(f.duration, getMaxDuration(date)),
            }
          : f
      )
    );
  };

  // Handle duration change
  const handleDurationChange = (facilityId: string, duration: number) => {
    setSelectedFacilities((prev) =>
      prev.map((f) => (f.id === facilityId ? { ...f, duration } : f))
    );
  };

  // Validation and submit
  const handleSubmit = async () => {
    if (selectedFacilities.length === 0) {
      toast.error("Please select at least one facility.");
      return;
    }
    // Validate each facility
    for (const f of selectedFacilities) {
      if (!f.startDate) {
        toast.error(`Please select a start date for ${f.name}.`);
        return;
      }
      const start = parseISO(f.startDate);
      const inDate = parseISO(checkIn);
      const outDate = parseISO(checkOut);
      if (isBefore(start, inDate) || isAfter(start, outDate)) {
        toast.error(`Start date for ${f.name} must be within your stay.`);
        return;
      }
      if (f.duration < 1 || f.duration > getMaxDuration(f.startDate)) {
        toast.error(
          `Duration for ${f.name} must be between 1 and ${getMaxDuration(
            f.startDate
          )} months.`
        );
        return;
      }
    }
    setIsSubmitting(true);
    try {
      await onSubmit(selectedFacilities);
      toast.success("Redirecting to payment...");
      setSelectedFacilities([]);
      onClose();
    } catch (err) {
      toast.error("Failed to add facilities. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg sm:max-w-md md:max-w-lg mx-2"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <h2 className="text-xl font-semibold mb-4">
              Add Facilities to Your Booking
            </h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {hostelFacilities.map((facility, idx) => {
                const selected = selectedFacilities.find(
                  (f) => f.id === facility._id
                );
                return (
                  <motion.div
                    key={facility._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b pb-3 mb-3"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={() => handleToggle(facility)}
                      />
                      <span className="font-medium">{facility.name}</span>
                      <span className="text-sm text-gray-500">
                        (₹{facility.price}/month)
                      </span>
                    </label>
                    {selected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="ml-6 mt-2 flex flex-col gap-2"
                      >
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Start Date
                          </label>
                          <DatePicker
                            selected={
                              selected.startDate
                                ? new Date(selected.startDate)
                                : null
                            }
                            onChange={(date: Date | null) =>
                              date &&
                              handleDateChange(
                                facility._id,
                                date.toISOString().slice(0, 10)
                              )
                            }
                            minDate={new Date(checkIn)}
                            maxDate={new Date(checkOut)}
                            dateFormat="yyyy-MM-dd"
                            className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-[#b9a089]"
                            popperPlacement="bottom-start"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Duration (months)
                          </label>
                          <select
                            value={selected.duration}
                            onChange={(e) =>
                              handleDurationChange(
                                facility._id,
                                Number(e.target.value)
                              )
                            }
                            className="border rounded px-2 py-1"
                          >
                            {Array.from(
                              { length: getMaxDuration(selected.startDate) },
                              (_, i) => i + 1
                            ).map((month) => (
                              <option key={month} value={month}>
                                {month} {month === 1 ? "month" : "months"}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-[#b9a089] text-white hover:bg-[#a58e77]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Buy"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuyFacilityModal;

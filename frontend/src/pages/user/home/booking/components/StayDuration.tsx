import React from "react";

interface StayDurationProps {
  startDate: string;
  selectedMonths: number;
  selectedFacilities: {
    id: string;
    name: string;
    duration: number;
  }[];
  minDate: string;
  onDateChange: (date: string) => void;
  onMonthsChange: (
    months: number,
    updatedFacilities: {
      id: string;
      name: string;
      duration: number;
    }[]
  ) => void;
}

const StayDuration: React.FC<StayDurationProps> = ({
  startDate,
  selectedMonths,
  selectedFacilities,
  minDate,
  onDateChange,
  onMonthsChange,
}) => {
  // Helper function to properly add months to a date
  const addMonthsToDate = (date: Date, months: number) => {
    const newDate = new Date(date);
    const currentYear = newDate.getFullYear();
    const currentMonth = newDate.getMonth();
    const newMonth = currentMonth + months;
    
    newDate.setFullYear(
      currentYear + Math.floor(newMonth / 12),
      newMonth % 12,
      newDate.getDate()
    );
    
    return newDate;
  };

  // Validate minimum stay duration
  const validateMinimumStay = (checkIn: string, duration: number) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = addMonthsToDate(checkInDate, duration);
    const oneMonthFromCheckIn = addMonthsToDate(checkInDate, 1);

    return checkOutDate >= oneMonthFromCheckIn;
  };

  const handleMonthsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDuration = parseInt(e.target.value);

    // Validate minimum stay duration
    if (!validateMinimumStay(startDate, newDuration)) {
      // Show warning but allow selection
      console.warn("Selected duration may not meet minimum 1-month requirement");
    }

    // Update any facility durations that exceed the new stay duration
    const updatedFacilities = selectedFacilities.map((facility) => {
      if (facility.duration > newDuration) {
        return { ...facility, duration: newDuration };
      }
      return facility;
    });

    onMonthsChange(newDuration, updatedFacilities);
  };

  // Check if current selection meets minimum stay requirement
  const meetsMinimumStay = validateMinimumStay(startDate, selectedMonths);

  // Calculate and format check-out date
  const calculateCheckOutDate = () => {
    const checkInDate = new Date(startDate);
    const checkOutDate = addMonthsToDate(checkInDate, selectedMonths);
    
    return checkOutDate.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="mb-8 pb-6 border-b border-gray-200">
      <h2 className="font-serif font-normal text-2xl mb-5 text-gray-800 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gray-300">
        Step 2 - Stay Duration
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date
          </label>
          <input
            type="date"
            min={minDate}
            value={startDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <select
            value={selectedMonths}
            onChange={handleMonthsChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors ${
              !meetsMinimumStay ? 'border-amber-300 bg-amber-50' : ''
            }`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
              <option key={month} value={month}>
                {month} {month === 1 ? "Month" : "Months"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show calculated check-out date */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-blue-700">
            <strong>Check-out Date:</strong> {calculateCheckOutDate()}
          </p>
        </div>
      </div>

      {/* Warning message for minimum stay requirement */}
      {!meetsMinimumStay && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-amber-700">
              <strong>Minimum Stay Required:</strong> Your selected duration may not meet the minimum 1-month stay requirement. 
              Please ensure your check-out date is at least 1 month from your check-in date.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default StayDuration;
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
  const handleMonthsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDuration = parseInt(e.target.value);

    // Update any facility durations that exceed the new stay duration
    const updatedFacilities = selectedFacilities.map((facility) => {
      if (facility.duration > newDuration) {
        return { ...facility, duration: newDuration };
      }
      return facility;
    });

    onMonthsChange(newDuration, updatedFacilities);
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
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
              <option key={month} value={month}>
                {month} {month === 1 ? "Month" : "Months"}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default StayDuration;
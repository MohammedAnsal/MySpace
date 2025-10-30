import React from "react";
import { toast } from "sonner";

interface Facility {
  _id: string;
  name: string;
  price: number;
}

interface SelectedFacility {
  id: string;
  name: string;
  duration: number;
}

interface FacilitiesSelectionProps {
  facilities: Facility[];
  selectedFacilities: SelectedFacility[];
  selectedMonths: number;
  onFacilityToggle: (facilityId: string, facilityName: string) => void;
  onFacilityDurationChange: (facilityId: string, duration: number) => void;
}

const FacilitiesSelection: React.FC<FacilitiesSelectionProps> = ({
  facilities,
  selectedFacilities,
  selectedMonths,
  onFacilityToggle,
  onFacilityDurationChange,
}) => {
  const handleFacilityDurationChange = (
    facilityId: string,
    duration: number
  ) => {
    if (duration > selectedMonths) {
      toast.error("Facility duration cannot exceed your stay duration");
      duration = selectedMonths;
    }
    onFacilityDurationChange(facilityId, duration);
  };

  return (
    <section className="mb-8 pb-6 border-b border-gray-200">
      <h2 className="font-serif font-normal text-2xl mb-5 text-gray-800 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gray-300">
        Step 3 - Select Facilities
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {facilities?.map((facility) => (
          <div key={facility._id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col space-y-2">
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFacilities.some(
                      (f) => f.id === facility._id
                    )}
                    onChange={() =>
                      onFacilityToggle(facility._id, facility.name)
                    }
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {facility.name}
                  </span>
                </div>
                <span className="text-sm text-main-color font-medium">
                  ₹{facility.price}/month
                </span>
              </label>

              {/* Duration selector - Only show when facility is selected */}
              {selectedFacilities.some((f) => f.id === facility._id) && (
                <div className="ml-6 mt-2">
                  <div className="flex items-center space-x-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Duration:
                    </label>
                    <select
                      value={
                        selectedFacilities.find((f) => f.id === facility._id)
                          ?.duration || 1
                      }
                      onChange={(e) =>
                        handleFacilityDurationChange(
                          facility._id,
                          parseInt(e.target.value)
                        )
                      }
                      className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm"
                    >
                      {/* Only show options up to the selected stay duration */}
                      {Array.from(
                        { length: selectedMonths },
                        (_, i) => i + 1
                      ).map((month) => (
                        <option key={month} value={month}>
                          {month} {month === 1 ? "Month" : "Months"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FacilitiesSelection;

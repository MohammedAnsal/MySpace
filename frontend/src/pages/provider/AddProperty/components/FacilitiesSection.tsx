import { useNavigate } from "react-router-dom";
import { useFacilities } from "@/hooks/useFacilities";
import Loading from "@/components/global/Loading";

interface FacilitiesSectionProps {
  formData: any;
  handleFacilityToggle: (facilityName: string) => void;
  // availableFacilities: { id: string; name: string; isAvailable: boolean }[];
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  formData,
  handleFacilityToggle,
  // availableFacilities
}) => {
  const navigate = useNavigate();
  const { facilities, isLoading, error } = useFacilities();

  // Filter only available (unblocked) facilities
  const availableFacilities = facilities.filter(
    (facility: any) => facility.status
  );

  console.log(availableFacilities)

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-amber-100">
        <Loading color="#FFB300" text="Loading facilities..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-amber-100">
        <p className="text-red-500">Error loading facilities</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-amber-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium flex items-center text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-amber-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Available Facilities
        </h2>
        <button
          type="button"
          onClick={() => navigate("/provider/facilities")}
          className="text-amber-600 hover:text-amber-700 text-sm flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Manage Facilities
        </button>
      </div>

      {availableFacilities.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No facilities available. Click "Manage Facilities" to add some.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {availableFacilities.map((facility: any) => (
            <div
              key={facility._id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.facilities.includes(facility._id)
                  ? "border-amber-400 bg-amber-50"
                  : "border-gray-200 hover:bg-amber-50 hover:border-amber-200"
              }`}
              onClick={() => handleFacilityToggle(facility._id)}
            >
              <input
                type="checkbox"
                checked={formData.facilities.includes(facility._id)}
                onChange={() => {}}
                className="mr-2 accent-amber-500"
              />
              <div className="flex flex-col flex-1">
                <span className="text-gray-700">{facility.name}</span>
                <span className="text-sm text-gray-500">₹{facility.price}</span>
                {facility.description && (
                  <span className="text-xs text-gray-500 mt-1">
                    {facility.description}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from "react";
import {
  Wifi,
  Car,
  CookingPot,
  AirVentIcon,
  WashingMachine,
  GlassWaterIcon,
  Cctv
} from "lucide-react";

interface AmenitiesSectionProps {
  formData: {
    amenities: string[];
  };
  errors: {
    amenities?: string;
  };
  handleAmenityToggle: (amenity: string) => void;
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  formData,
  errors,
  handleAmenityToggle,
}) => {
  const amenityOptions = [
    { id: "Wifi", label: "WiFi", icon: <Wifi size={20} /> },
    { id: "Parking", label: "Parking", icon: <Car size={20} /> },
    { id: "Kitchen", label: "Kitchen", icon: <CookingPot size={20} /> },
    {
      id: "Air Conditioning",
      label: "Air Conditioning",
      icon: <AirVentIcon size={20} />,
    },
    { id: "Laundry", label: "Laundry", icon: <WashingMachine size={20} /> },
    { id: "Cctv", label: "cctv", icon: <Cctv size={20} /> },
    {
      id: "Water filter",
      label: "Water filter",
      icon: <GlassWaterIcon size={20} />,
    },
  ];

  return (
    <div className="bg-white border border-amber-100 p-4 rounded-lg shadow-sm sm:p-6">
      <h2 className="flex text-gray-800 text-xl font-medium items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 text-amber-500 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
        Features and Amenities
      </h2>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4 md:grid-cols-3 sm:gap-4 sm:grid-cols-2">
        {amenityOptions.map((amenity) => (
          <div
            key={amenity.id}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              formData.amenities.includes(amenity.id)
                ? "border-amber-400 bg-amber-50"
                : "border-gray-200 hover:bg-amber-50 hover:border-amber-200"
            }`}
            onClick={() => handleAmenityToggle(amenity.id)}
          >
            <input
              type="checkbox"
              checked={formData.amenities.includes(amenity.id)}
              onChange={() => {}}
              className="accent-amber-500 mr-2"
            />
            <div className="flex items-center">
              {amenity.icon && (
                <span className="text-amber-600 mr-2">{amenity.icon}</span>
              )}
              <span className="text-gray-700">{amenity.label}</span>
            </div>
          </div>
        ))}
      </div>
      {errors?.amenities && (
        <p className="mt-3 text-sm text-red-500">{errors.amenities}</p>
      )}
    </div>
  );
};

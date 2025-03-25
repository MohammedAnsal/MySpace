import React from 'react';
import { MapPin, Map } from 'lucide-react';

interface LocationSectionProps {
  formData: {
    address: string;
    latitude: number | null;
    longitude: number | null;
  };
  errors: {
    address?: string;
    latitude?: string;
    longitude?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setMapVisible: (visible: boolean) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  formData,
  errors,
  handleInputChange,
  setMapVisible,
}) => {
  return (
    <div className="bg-white border border-amber-100 p-4 rounded-lg shadow-sm sm:p-6">
      <h2 className="flex text-gray-800 text-xl font-medium items-center mb-4">
        <MapPin size={20} className="text-amber-500 mr-2" />
        Location
      </h2>

      <div className="md:col-span-2">
        <label className="text-gray-700 text-sm block font-medium mb-2">
          Address
        </label>
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <input
              type="text"
              disabled
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none px-3 py-2`}
              placeholder="Select address"
              required
              readOnly={formData.latitude !== null}
            />
            <button
              type="button"
              onClick={() => setMapVisible(true)}
              className="text-amber-500 absolute hover:text-amber-600 right-2 top-2"
              title="Select location on map"
            >
              <Map size={20} />
            </button>
          </div>
          
          {(errors.address || errors.latitude || errors.longitude) && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address || errors.latitude || errors.longitude}
            </p>
          )}
          
          {formData.latitude && formData.longitude && (
            <div className="flex text-green-600 text-sm items-center">
              <MapPin size={16} className="mr-1" />
              Location selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
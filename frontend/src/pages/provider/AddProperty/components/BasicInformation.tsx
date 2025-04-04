import React from "react";
import { Home } from "lucide-react";

interface BasicInformationProps {
  formData: {
    hostel_name: string;
    description: string;
    propertyType: string;
    gender: string;
  };
  errors: {
    hostel_name?: string;
    description?: string;
    propertyType?: string;
    gender?: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  return (
    <div className="bg-white border border-amber-100 p-4 rounded-lg shadow-sm sm:p-6">
      <h2 className="flex text-gray-800 text-xl font-medium items-center mb-4">
        <Home size={20} className="text-amber-500 mr-2" />
        Basic Information
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
        <div>
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Hostel Name *
          </label>
          <input
            type="text"
            name="hostel_name"
            value={formData.hostel_name}
            onChange={handleInputChange}
            className={`border ${
              errors.hostel_name ? "border-red-500" : "border-gray-300"
            } rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none px-3 py-2`}
            placeholder="e.g., Blue Horizon Hostel"
            aria-invalid={!!errors.hostel_name}
            aria-describedby={
              errors.hostel_name ? "hostel_name-error" : undefined
            }
          />
          {errors.hostel_name && (
            <p className="mt-1 text-sm text-red-500" id="hostel_name-error">
              {errors.hostel_name}
            </p>
          )}
        </div>

        <div>
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Property Type *
          </label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleInputChange}
            className={`border ${
              errors.propertyType ? "border-red-500" : "border-gray-300"
            } rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none px-3 py-2`}
            aria-invalid={!!errors.propertyType}
            aria-describedby={
              errors.propertyType ? "propertyType-error" : undefined
            }
          >
            {/* <option value="">Select property type</option> */}
            <option value="hostel">Hostel</option>
          </select>
          {errors.propertyType && (
            <p className="mt-1 text-sm text-red-500" id="propertyType-error">
              {errors.propertyType}
            </p>
          )}
        </div>

        <div>
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Gender Type *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`border ${
              errors.gender ? "border-red-500" : "border-gray-300"
            } rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none px-3 py-2`}
          >
            <option value="">Select gender type</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none px-3 py-2`}
            placeholder="Provide a detailed description of your hostel (minimum 50 characters)"
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500" id="description-error">
              {errors.description}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/1000 characters
          </p>
        </div>
      </div>
    </div>
  );
};

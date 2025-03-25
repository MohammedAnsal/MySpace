import React from 'react';
import { DollarSign, Users, Maximize2 } from 'lucide-react';

interface DetailsSectionProps {
  formData: {
    price: string;
    deposit: string;
    depositTerms: string;
    totalSpace: string;
    maxOccupancy: string;
  };
  errors: {
    price?: string;
    deposit?: string;
    depositTerms?: string;
    totalSpace?: string;
    maxOccupancy?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const DetailsSection: React.FC<DetailsSectionProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  return (
    <div className="bg-white border border-amber-100 p-4 rounded-lg shadow-sm sm:p-6">
      <h2 className="flex text-gray-800 text-xl font-medium items-center mb-4">
        <DollarSign size={20} className="text-amber-500 mr-2" />
        Property Details
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
        <div>
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Monthly Rent
          </label>
          <div className="relative">
            <span className="text-gray-500 absolute left-3 top-2">
              <DollarSign size={20} />
            </span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none pl-10 pr-3 py-2`}
              placeholder="Enter price"
              required
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Total Space
          </label>
          <div className="relative">
            <span className="text-gray-500 absolute left-3 top-2">
              <Maximize2 size={20} />
            </span>
            <input
              type="number"
              name="totalSpace"
              value={formData.totalSpace}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none pl-10 pr-3 py-2"
              placeholder="Enter total space"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Security Deposit
          </label>
          <div className="relative">
            <span className="text-gray-500 absolute left-3 top-2">
              <DollarSign size={20} />
            </span>
            <input
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none pl-10 pr-3 py-2"
              placeholder="Enter deposit amount"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Maximum Occupancy
          </label>
          <div className="relative">
            <span className="text-gray-500 absolute left-3 top-2">
              <Users size={20} />
            </span>
            <input
              type="number"
              name="maxOccupancy"
              value={formData.maxOccupancy}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none pl-10 pr-3 py-2"
              placeholder="Max number of guests"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Deposit Terms
          </label>
          <textarea
            name="depositTerms"
            value={formData.depositTerms}
            onChange={handleInputChange}
            className={`border ${
              errors.depositTerms ? "border-red-500" : "border-gray-300"
            } rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none px-3 py-2`}
            placeholder="Enter deposit terms and conditions"
            rows={3}
            required
          />
          {errors.depositTerms && (
            <p className="mt-1 text-sm text-red-500">{errors.depositTerms}</p>
          )}
        </div>

        {/* <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700 text-sm block font-medium mb-2">
              Beds
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none px-3 py-2"
              placeholder="No. of beds"
              required
            />
          </div>
          <div>
            <label className="text-gray-700 text-sm block font-medium mb-2">
              Bathrooms
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none px-3 py-2"
              placeholder="No. of bathrooms"
              required
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}; 
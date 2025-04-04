import React from "react";
import { DollarSign, Users, Bed, IndianRupee } from "lucide-react";

interface DetailsSectionProps {
  formData: {
    monthly_rent: string;
    deposit_amount: string;
    deposit_terms: string;
    total_space: string;
    maximum_occupancy: string;
  };
  errors: {
    monthly_rent?: string;
    deposit_amount?: string;
    deposit_terms?: string;
    total_space?: string;
    maximum_occupancy?: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
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
              <IndianRupee size={20} />
            </span>
            <input
              type="number"
              name="monthly_rent"
              value={formData.monthly_rent}
              onChange={handleInputChange}
              className={`border ${
                errors.monthly_rent ? "border-red-500" : "border-gray-300"
              } rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none pl-10 pr-3 py-2`}
              placeholder="Enter price"
            />
          </div>
          {errors.monthly_rent && (
            <p className="mt-1 text-sm text-red-500">{errors.monthly_rent}</p>
          )}
        </div>

        <div>
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Total Space
          </label>
          <div className="relative">
            <span className="text-gray-500 absolute left-3 top-2">
              <Bed size={20} />
            </span>
            <input
              type="number"
              name="total_space"
              value={formData.total_space}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none pl-10 pr-3 py-2"
              placeholder="Enter total space"
            />
          </div>
          {errors.total_space && (
            <p className="mt-1 text-sm text-red-500">{errors.total_space}</p>
          )}
        </div>

        <div>
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Security Deposit
          </label>
          <div className="relative">
            <span className="text-gray-500 absolute left-3 top-2">
              <IndianRupee size={20} />
            </span>
            <input
              type="number"
              name="deposit_amount"
              value={formData.deposit_amount}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none pl-10 pr-3 py-2"
              placeholder="Enter deposit amount"
            />
          </div>
          {errors.deposit_amount && (
            <p className="mt-1 text-sm text-red-500">{errors.deposit_amount}</p>
          )}
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
              name="maximum_occupancy"
              value={formData.maximum_occupancy}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none pl-10 pr-3 py-2"
              placeholder="Max number of guests"
            />
          </div>
          {errors.maximum_occupancy && (
            <p className="mt-1 text-sm text-red-500">{errors.maximum_occupancy}</p>
          )}
        </div>

        <div>
          <label className="text-gray-700 text-sm block font-medium mb-2">
            Deposit Terms
          </label>
          <textarea
            name="deposit_terms"
            value={formData.deposit_terms}
            onChange={handleInputChange}
            className={`border ${
              errors.deposit_terms ? "border-red-500" : "border-gray-300"
            } rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none px-3 py-2`}
            placeholder="Enter deposit terms and conditions"
            rows={3}
          />
          {errors.deposit_terms && (
            <p className="mt-1 text-sm text-red-500">{errors.deposit_terms}</p>
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
              
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

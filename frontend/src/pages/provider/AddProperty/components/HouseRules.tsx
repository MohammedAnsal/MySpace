import React from 'react';
import { AlertCircle } from 'lucide-react';

interface HouseRulesProps {
  formData: {
    rules: string;
  };
  errors: {
    rules?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const HouseRules: React.FC<HouseRulesProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  return (
    <div className="bg-white border border-amber-100 p-4 rounded-lg shadow-sm sm:p-6">
      <h2 className="flex text-gray-800 text-xl font-medium items-center mb-4">
        <AlertCircle size={20} className="text-amber-500 mr-2" />
        House Rules
      </h2>

      <div>
        <label className="text-gray-700 text-sm block font-medium mb-2">
          Property Rules & Policies
        </label>
        <textarea
          name="rules"
          value={formData.rules}
          onChange={handleInputChange}
          rows={3}
          className={`border ${errors.rules ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full focus:border-amber-300 focus:ring-2 focus:ring-amber-300 outline-none px-3 py-2`}
          placeholder="Specify any rules or policies for your property"
        />
        {errors.rules && (
          <p className="mt-1 text-sm text-red-500">{errors.rules}</p>
        )}
      </div>
    </div>
  );
}; 
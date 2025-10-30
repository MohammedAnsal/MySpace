import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Star } from 'lucide-react';

interface SidebarProps {
  filters: {
    minPrice: number;
    maxPrice: number;
    gender: string;
    amenities: string[];
    minRating?: number;
  };
  onFilterChange: (filters: Partial<FilterState>) => void;
}

interface FilterState {
  minPrice: number;
  maxPrice: number;
  gender: string;
  amenities: string[];
  search: string;
  sortBy: 'asc' | 'desc';
  minRating?: number;
  sortByRating?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, onFilterChange }) => {
  const handleRatingChange = (rating: number) => {
    onFilterChange({ minRating: rating === 0 ? undefined : rating });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-medium mb-6">Filters</h2>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-4">Price Range</h3>
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          max={5000}
          min={10}
          step={10}
          className="mb-2"
          onValueChange={(value) =>
            onFilterChange({ minPrice: value[0], maxPrice: value[1] })
          }
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>₹{filters.minPrice}</span>
          <span>₹{filters.maxPrice}</span>
        </div>
      </div>

      {/* Category */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-4">Category</h3>
        <div className="space-y-3">
          {["male", "female"].map((gender) => (
            <label
              key={gender}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={filters.gender === gender}
                onChange={(e) => onFilterChange({ gender: e.target.value })}
                className="text-amber-500 focus:ring-amber-500 h-4 w-4"
              />
              <span className="text-gray-700 capitalize">{gender}</span>
            </label>
          ))}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value=""
              checked={filters.gender === ""}
              onChange={() => onFilterChange({ gender: "" })}
              className="text-amber-500 focus:ring-amber-500 h-4 w-4"
            />
            <span className="text-gray-700">All</span>
          </label>
        </div>
      </div>

      {/* Facilities */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-4">Amenities</h3>
        <div className="space-y-3">
          {["Wifi", "Parking", "Kitchen", "Air Conditioning"].map((amenity) => (
            <label
              key={amenity}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={(e: any) => {
                  const newAmenities = e.target.checked
                    ? [...filters.amenities, amenity]
                    : filters.amenities.filter((a) => a !== amenity);
                  onFilterChange({ amenities: newAmenities });
                }}
                className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
              />
              <span className="text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="font-medium text-gray-900 mb-3">Rating</h3>
        <div className="space-y-2">
          {[0, 3, 4, 5].map((rating) => (
            <div 
              key={rating} 
              className="flex items-center"
            >
              <input
                type="radio"
                id={`rating-${rating}`}
                name="rating"
                checked={filters.minRating === rating || (rating === 0 && filters.minRating === undefined)}
                onChange={() => handleRatingChange(rating)}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label 
                htmlFor={`rating-${rating}`} 
                className="ml-2 text-gray-700 flex items-center"
              >
                {rating === 0 ? (
                  "Any Rating"
                ) : (
                  <>
                    <span className="flex">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      {[...Array(5-rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gray-300" />
                      ))}
                    </span>
                    <span className="ml-1">& above</span>
                  </>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

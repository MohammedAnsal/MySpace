import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showText?: boolean;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  size = 16, 
  showText = true,
  className = ""
}) => {
  // Handle empty or invalid ratings
  if (isNaN(rating) || rating < 0) {
    rating = 0;
  }
  
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={size}
            className="text-amber-500 fill-amber-500"
          />
        ))}
        
        {/* Half star */}
        {halfStar && (
          <div className="relative">
            <Star size={size} className="text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={size} className="text-amber-500 fill-amber-500" />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            className="text-gray-300"
          />
        ))}
      </div>
      
      {showText && rating > 0 && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
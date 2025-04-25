import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { toast } from 'sonner';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostelId: string;
  userId: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

const RatingModal: React.FC<RatingModalProps> = ({ 
  isOpen, 
  onClose, 
  hostelId,
  userId,
  onSubmit
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(rating, comment);
      
      toast.success('Thank you for your rating!');
      handleClose();
    } catch (error) {
      toast.error('Failed to submit rating. Please try again.');
      console.error('Rating submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative">
        {/* Header */}
        <div className="bg-[#b9a089]/10 px-4 py-3 rounded-t-lg flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Rate Your Stay</h3>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5">
          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex justify-center space-x-2 mb-3">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transform transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    fill={(hoveredRating || rating) >= starValue ? '#FFD700' : 'none'}
                    stroke={(hoveredRating || rating) >= starValue ? '#FFD700' : '#9CA3AF'}
                  />
                </button>
              ))}
            </div>
            <div className="text-center text-sm font-medium text-gray-600">
              {rating > 0 && (
                <span>
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>
          
          {/* Comment */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Share your experience (optional)
            </label>
            <textarea
              id="comment"
              placeholder="Tell us about your stay..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#b9a089] focus:border-[#b9a089] focus:outline-none transition duration-200 min-h-[100px]"
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 mr-2 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#b9a089] rounded-md hover:bg-[#a58e77] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal; 
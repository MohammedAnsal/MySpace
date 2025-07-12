import React, { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 30,
      rotateX: -10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: { 
        type: "spring", 
        damping: 20, 
        stiffness: 300,
        duration: 0.5
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 30,
      rotateX: -10,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      } 
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.2,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const starVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: (i: number) => ({ 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: { 
        delay: 0.3 + (i * 0.1),
        duration: 0.4,
        type: "spring",
        stiffness: 200
      }
    })
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.6,
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <motion.div 
              className="bg-gradient-to-r from-[#b9a089]/10 to-[#b9a089]/20 px-6 py-4 border-b border-[#b9a089]/20"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Rate Your Stay</h3>
                <motion.button 
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </motion.div>
            
            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Rating Stars */}
              <motion.div 
                className="mb-6"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  How would you rate your experience?
                </label>
                <div className="flex justify-center space-x-3 mb-4">
                  {[1, 2, 3, 4, 5].map((starValue, index) => (
                    <motion.button
                      key={starValue}
                      type="button"
                      custom={index}
                      variants={starVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoveredRating(starValue)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transform transition-all duration-200"
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Star
                        size={36}
                        fill={(hoveredRating || rating) >= starValue ? '#FFD700' : 'none'}
                        stroke={(hoveredRating || rating) >= starValue ? '#FFD700' : '#9CA3AF'}
                        className="drop-shadow-sm"
                      />
                    </motion.button>
                  ))}
                </div>
                <AnimatePresence>
                  {rating > 0 && (
                    <motion.div 
                      className="text-center text-sm font-medium text-gray-600"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-semibold">
                        {rating === 1 && 'Poor'}
                        {rating === 2 && 'Fair'}
                        {rating === 3 && 'Good'}
                        {rating === 4 && 'Very Good'}
                        {rating === 5 && 'Excellent'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Comment */}
              <motion.div 
                className="mb-6"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Share your experience (optional)
                </label>
                <motion.textarea
                  id="comment"
                  placeholder="Tell us about your stay..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a089] focus:border-[#b9a089] focus:outline-none transition-all duration-200 min-h-[120px] resize-none"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
              
              {/* Submit Buttons */}
              <motion.div 
                className="flex justify-end gap-3"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#b9a089] to-[#a58e77] rounded-lg hover:from-[#a58e77] hover:to-[#8b7a65] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Submitting...
                    </>
                  ) : 'Submit Rating'}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal; 
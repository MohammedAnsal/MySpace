import React, { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onSubmit: (reason: string) => Promise<void>;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({ 
  isOpen, 
  onClose, 
  // bookingId,
  onSubmit
}) => {
  const [reason, setReason] = useState<string>('');
  const [reasonError, setReasonError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleClose = () => {
    setReason('');
    setReasonError('');
    onClose();
  };

  const validateReason = () => {
    if (!reason.trim()) {
      setReasonError("Please provide a reason for cancellation");
      return false;
    }
    if (reason.trim().length < 5) {
      setReasonError("Reason must be at least 10 characters long");
      return false;
    }
    setReasonError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateReason()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(reason);
      
      toast.success('Booking cancelled successfully');
      handleClose();
    } catch (error) {
      toast.error('Failed to cancel booking. Please try again.');
      console.error('Cancellation error:', error);
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
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        delay: 0.1,
        duration: 0.3
      }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300,
        delay: 0.1,
        duration: 0.4
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: { 
        duration: 0.25
      } 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div 
            className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="bg-red-50 px-4 py-3 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center text-red-600">
                <AlertTriangle className="mr-2" size={20} />
                <h3 className="text-lg font-medium">Cancel Booking?</h3>
              </div>
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <form onSubmit={handleSubmit} className="p-5">
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              
              {/* Reason */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Please provide a reason for cancellation:
                </label>
                <textarea
                  id="reason"
                  placeholder="Why are you cancelling this booking?"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (e.target.value.trim().length >= 10) {
                      setReasonError("");
                    }
                  }}
                  className={`w-full p-3 border ${reasonError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-red-500 focus:border-red-500 focus:outline-none transition duration-200 min-h-[100px]`}
                />
                <AnimatePresence>
                  {reasonError && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {reasonError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Submit Button */}
              <motion.div 
                className="flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 mr-2 transition-colors"
                  disabled={isSubmitting}
                >
                  No, Keep It
                </button>
                
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Processing...
                    </>
                  ) : 'Yes, Cancel Booking'}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CancelBookingModal; 
import React from "react";
import { motion } from "framer-motion";

interface PaymentSectionProps {
  acceptedRules: boolean;
  isSubmitting: boolean;
  calculatePaymentTotal: () => number;
  calculateTotalPrice: () => number;
  onSubmit: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  acceptedRules,
  isSubmitting,
  calculatePaymentTotal,
  calculateTotalPrice,
  onSubmit,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-b-lg">
      <motion.button
        disabled={!acceptedRules || isSubmitting}
        onClick={onSubmit}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group ${
          acceptedRules && !isSubmitting
            ? "bg-main-color text-white"
            : "bg-gray-300 cursor-not-allowed text-gray-500"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {acceptedRules ? (
              <>
                Pay Now: ${calculatePaymentTotal()}
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            ) : (
              "Accept Rules to Continue"
            )}
          </div>
        )}
      </motion.button>
      {acceptedRules && !isSubmitting && (
        <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-center text-gray-700 font-medium">
            Payment Summary
          </p>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span>First Payment:</span>
            <span className="font-semibold">${calculatePaymentTotal()}</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span>Total Booking Value:</span>
            <span className="font-semibold">${calculateTotalPrice()}</span>
          </div>
          <p className="text-xs text-center mt-2 text-gray-500">
            You'll be charged ${calculatePaymentTotal()} now for your first payment.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;

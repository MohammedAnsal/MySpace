import React from "react";
import { WalletIcon } from "lucide-react";
import { motion } from "framer-motion";

interface WalletSummaryProps {
  walletBalance: number;
  totalCredits: number;
  totalBookingRevenue: number;
  transactionCount: number;
  pendingTransactions: number;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({
  walletBalance,
  totalCredits,
  totalBookingRevenue,
  transactionCount,
  pendingTransactions,
}) => {
  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <motion.div
        className="bg-gradient-to-r from-[#3A3B3F] to-[#2A2B2F] rounded-xl p-6 text-white shadow-lg border border-[#C8ED4F]/20 col-span-1 lg:col-span-2"
        variants={cardVariants}
      >
        <div className="flex items-center mb-2">
          <WalletIcon className="text-[#C8ED4F] mr-2" size={24} />
          <h2 className="text-2xl font-semibold">Admin Treasury</h2>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-400">Available Balance</p>
          <h1 className="text-4xl font-bold mt-1 text-[#C8ED4F]">
            ₹{walletBalance.toFixed(2)}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Platform commission from all bookings
          </p>
        </div>
      </motion.div>

      <motion.div
        className="bg-[#3A3B3F] rounded-xl p-6 shadow-md border border-gray-700"
        variants={cardVariants}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-300">
          Quick Stats
        </h3>
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-400">Total Platform Revenue</p>
            <p className="text-2xl font-bold text-[#C8ED4F]">
              ₹{totalCredits.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Booking Revenue</p>
            <p className="text-2xl font-bold text-white">
              ₹{totalBookingRevenue.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Transaction Count</p>
            <p className="text-2xl font-bold text-white">
              {transactionCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Pending Transactions</p>
            <p className="text-lg font-semibold text-yellow-400">
              {pendingTransactions || "None"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletSummary; 
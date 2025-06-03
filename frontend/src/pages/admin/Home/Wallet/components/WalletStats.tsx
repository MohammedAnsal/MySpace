import React from "react";
import { Calendar, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface WalletStatsProps {
  firstTransactionDate: string;
  totalBookings: number;
  currentMonthCredits: number;
  currentMonthDebits: number;
}

const WalletStats: React.FC<WalletStatsProps> = ({
  firstTransactionDate,
  totalBookings,
  currentMonthCredits,
  currentMonthDebits,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#3A3B3F] p-4 rounded-lg border border-gray-700 flex items-center">
        <div className="h-10 w-10 rounded-full bg-[#C8ED4F]/10 flex items-center justify-center mr-3">
          <Calendar className="h-5 w-5 text-[#C8ED4F]" />
        </div>
        <div>
          <p className="text-sm text-gray-400">First Transaction</p>
          <p className="font-medium text-white">{firstTransactionDate}</p>
        </div>
      </div>

      <div className="bg-[#3A3B3F] p-4 rounded-lg border border-gray-700 flex items-center">
        <div className="h-10 w-10 rounded-full bg-[#C8ED4F]/10 flex items-center justify-center mr-3">
          <TrendingUp className="h-5 w-5 text-[#C8ED4F]" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Total Bookings</p>
          <p className="font-medium text-white">{totalBookings}</p>
        </div>
      </div>

      <div className="bg-[#3A3B3F] p-4 rounded-lg border border-gray-700 flex items-center">
        <div className="h-10 w-10 rounded-full bg-[#C8ED4F]/10 flex items-center justify-center mr-3">
          <ArrowDownRight className="h-5 w-5 text-[#C8ED4F]" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Current Month Income</p>
          <p className="font-medium text-[#C8ED4F]">
            ${currentMonthCredits.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-[#3A3B3F] p-4 rounded-lg border border-gray-700 flex items-center">
        <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
          <ArrowUpRight className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Current Month Expenses</p>
          <p className="font-medium text-red-400">
            ${currentMonthDebits.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Including refunds</p>
        </div>
      </div>
    </div>
  );
};

export default WalletStats; 
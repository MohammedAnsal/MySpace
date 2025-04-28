import React from "react";
import { motion } from "framer-motion";
import { Info, DollarSign } from "lucide-react";

const WalletInfo: React.FC = () => {
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center text-white">
        <Info size={20} className="mr-2 text-[#C8ED4F]" />
        Admin Wallet Information
      </h3>
      <div className="space-y-5 text-gray-300">
        <div className="bg-[#2A2B2F] p-4 rounded-lg border border-[#C8ED4F]/20">
          <h4 className="font-medium text-[#C8ED4F] mb-2 flex items-center">
            <DollarSign size={18} className="mr-2" />
            Revenue Distribution
          </h4>
          <p className="text-gray-300">
            The admin wallet collects 30% of all booking payments as
            platform commissions. Providers receive the remaining 70% of
            each booking amount.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-200 mb-2">
            Platform Treasury
          </h4>
          <p>
            This wallet serves as the central treasury for the platform,
            collecting all commissions from hostel bookings automatically.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-200 mb-2">
            Transaction Types
          </h4>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              <span className="text-[#C8ED4F] font-medium">Credit:</span>{" "}
              Commission revenue from bookings
            </li>
            <li>
              <span className="text-red-400 font-medium">Debit:</span>{" "}
              Payouts, refunds or operational expenses
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-200 mb-2">
            Status Definitions
          </h4>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              <span className="text-[#C8ED4F] font-medium">
                Completed:
              </span>{" "}
              Transaction successfully processed
            </li>
            <li>
              <span className="text-yellow-400 font-medium">
                Pending:
              </span>{" "}
              Transaction in progress
            </li>
            <li>
              <span className="text-red-400 font-medium">Failed:</span>{" "}
              Transaction that couldn't be completed
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-200 mb-2">
            Admin Controls
          </h4>
          <p>
            As an admin, you have full visibility into all financial
            transactions on the platform. The wallet dashboard provides
            real-time insights into the platform's financial health.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletInfo; 
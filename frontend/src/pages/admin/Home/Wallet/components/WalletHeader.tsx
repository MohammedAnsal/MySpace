import React from "react";
import { WalletIcon, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface WalletHeaderProps {
  onRefresh: () => void;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-white flex items-center">
        <WalletIcon className="mr-2 text-[#C8ED4F]" size={28} />
        Admin Wallet
      </h1>
      <button
        onClick={onRefresh}
        className="flex items-center px-3 py-2 bg-[#C8ED4F]/10 text-[#C8ED4F] rounded-lg hover:bg-[#C8ED4F]/20 transition-colors"
      >
        <RefreshCw size={16} className="mr-2" />
        Refresh
      </button>
    </div>
  );
};

export default WalletHeader; 
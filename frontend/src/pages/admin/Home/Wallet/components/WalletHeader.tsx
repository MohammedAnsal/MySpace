import React from "react";
import { WalletIcon } from "lucide-react";

const WalletHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-white flex items-center">
        <WalletIcon className="mr-2 text-[#C8ED4F]" size={28} />
        Admin Wallet
      </h1>
    </div>
  );
};

export default WalletHeader;

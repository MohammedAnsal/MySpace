import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { getProviderWallet } from "@/services/Api/providerApi";
import { useNavigate } from "react-router-dom";

const WalletSummary: React.FC = () => {
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState<{
    balance: number;
    totalCredits: number;
    totalDebits: number;
    pendingTransactions: number;
  }>({
    balance: 0,
    totalCredits: 0,
    totalDebits: 0,
    pendingTransactions: 0,
  });
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // setLoading(true);
        const response = await getProviderWallet();

        if (response && response.success) {
          // Calculate summary data
          const transactions = response.data.transactions || [];
          const totalCredits = transactions
            .filter((t: any) => {
              try {
                // Validate transaction date if needed
                if (t.created_at) {
                  const date = new Date(t.created_at);
                  if (isNaN(date.getTime())) {
                    console.warn("Invalid date found:", t.created_at);
                    return false;
                  }
                }
                return t.type === "credit" && t.status === "completed";
              } catch (error) {
                console.error("Error processing transaction:", error);
                return false;
              }
            })
            .reduce((sum: number, t: any) => sum + t.amount, 0);

          const totalDebits = transactions
            .filter((t: any) => {
              try {
                // Validate transaction date if needed
                if (t.created_at) {
                  const date = new Date(t.created_at);
                  if (isNaN(date.getTime())) {
                    console.warn("Invalid date found:", t.created_at);
                    return false;
                  }
                }
                return t.type === "debit" && t.status === "completed";
              } catch (error) {
                console.error("Error processing transaction:", error);
                return false;
              }
            })
            .reduce((sum: number, t: any) => sum + t.amount, 0);

          const pendingTransactions = transactions.filter(
            (t: any) => t.status === "pending"
          ).length;

          setWalletData({
            balance: response.data.balance || 0,
            totalCredits,
            totalDebits,
            pendingTransactions,
          });
        }
      } catch (err) {
        console.error("Error fetching wallet data:", err);
      } finally {
        // setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleViewWallet = () => {
    navigate("/provider/wallet");
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Wallet Summary</h2>
        <button
          onClick={handleViewWallet}
          className="text-amber-600 hover:text-amber-700 text-sm font-medium"
        >
          View Details
        </button>
      </div>

      <div className="flex items-center mb-4">
        <div className="bg-amber-100 p-3 rounded-full mr-4">
          <Wallet className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Available Balance</p>
          <p className="text-xl font-bold">${walletData.balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
            <p className="text-gray-600 text-sm">Total Income</p>
          </div>
          <p className="text-lg font-semibold mt-1">
            ${walletData.totalCredits.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
            <p className="text-gray-600 text-sm">Total Expenses</p>
          </div>
          <p className="text-lg font-semibold mt-1">
            ${walletData.totalDebits.toFixed(2)}
          </p>
        </div>
      </div>

      {walletData.pendingTransactions > 0 && (
        <div className="mt-4 bg-amber-50 p-3 rounded-lg border border-amber-100">
          <p className="text-amber-700 text-sm">
            You have {walletData.pendingTransactions} pending transaction
            {walletData.pendingTransactions > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletSummary;

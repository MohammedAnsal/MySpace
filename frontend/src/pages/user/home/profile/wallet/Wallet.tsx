import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useUserWallet,
  useWalletTransactions,
} from "@/hooks/user/wallet/useWallet";
import {
  FaWallet,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaHistory,
  FaUndo,
  FaChartLine,
} from "react-icons/fa";
import { format } from "date-fns";
import Loading from "@/components/global/Loading";

interface Transaction {
  _id: string;
  amount: number;
  type: "credit" | "debit" | "re-fund";
  status: "completed" | "pending" | "failed";
  description: string;
  createdAt: string;
}

export const Wallet: React.FC = () => {
  const { data: wallet, isLoading: isWalletLoading } = useUserWallet();
  const { data: transactions, isLoading: isTransactionsLoading } =
    useWalletTransactions();
  const [filter, setFilter] = useState<"all" | "credit" | "debit" | "re-fund">(
    "all"
  );

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: 0.1 + i * 0.05 },
    }),
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy • h:mm a");
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "credit":
        return <FaMoneyBillWave className="text-emerald-500" />;
      case "debit":
        return <FaExchangeAlt className="text-rose-500" />;
      case "re-fund":
        return <FaUndo className="text-blue-500" />;
      default:
        return <FaExchangeAlt className="text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "credit":
        return "text-emerald-500";
      case "debit":
        return "text-rose-500";
      case "re-fund":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const filteredTransactions =
    wallet?.transactions?.filter((transaction: Transaction) =>
      filter === "all" ? true : transaction.type === filter
    ) || [];

  const getTransactionStats = () => {
    if (!wallet?.transactions) return { credits: 0, debits: 0, refunds: 0 };

    return wallet.transactions.reduce(
      (
        acc: { credits: any; debits: any; refunds: any },
        transaction: { type: string; amount: any }
      ) => ({
        credits:
          acc.credits +
          (transaction.type === "credit" ? transaction.amount : 0),
        debits:
          acc.debits + (transaction.type === "debit" ? transaction.amount : 0),
        refunds:
          acc.refunds +
          (transaction.type === "re-fund" ? transaction.amount : 0),
      }),
      { credits: 0, debits: 0, refunds: 0 }
    );
  };

  if (isWalletLoading) {
    return (
      <motion.div
        className="flex items-center justify-center h-96"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div
          className="p-4 sm:p-8 mt-4 sm:mt-20 max-w-4xl mx-auto flex items-center justify-center"
          style={{ minHeight: "300px" }}
        >
          <Loading text="Loading wallet..." color="#b9a089" />
        </div>
      </motion.div>
    );
  }

  if (!wallet) {
    return (
      <motion.div
        className="text-center py-12 px-4"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <FaWallet className="mx-auto text-5xl text-[#a58e77] mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Wallet Not Found
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Your wallet hasn't been created yet. It will be created automatically
          when you book a hostel.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full bg-gray-50 rounded-2xl overflow-hidden shadow-lg mt-4 max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Main Wallet Card */}
        <motion.div
          className="lg:col-span-2 bg-gradient-to-br from-[#a58e77] to-[#8b745f] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden"
          variants={cardVariants}
        >
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 rounded-full transform translate-x-24 sm:translate-x-32 -translate-y-24 sm:-translate-y-32 blur-2xl sm:blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4 sm:mb-6">
              <FaWallet className="text-2xl sm:text-3xl mr-2 sm:mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold">My Wallet</h2>
            </div>
            <div className="mt-6 sm:mt-8">
              <p className="text-white/80 text-xs sm:text-sm font-medium">
                Available Balance
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-1 sm:mt-2">
                ₹{wallet?.balance.toFixed(2)}
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6"
          variants={cardVariants}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <FaChartLine className="mr-2 text-[#a58e77]" /> Transaction Stats
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(getTransactionStats()).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600 capitalize">
                  {key}
                </span>
                <span className="text-sm sm:text-base font-semibold text-gray-800">
                  ₹{(value as number).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
              <FaHistory className="mr-2 text-[#a58e77]" /> Transaction History
            </h3>
            <div className="w-full sm:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a58e77]/20"
              >
                <option value="all">All Transactions</option>
                <option value="credit">Credits</option>
                <option value="debit">Debits</option>
                <option value="re-fund">Refunds</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-2 sm:px-4 py-2">
          {isTransactionsLoading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#a58e77] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500 text-sm sm:text-base">
                Loading transactions...
              </p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map(
                (transaction: Transaction, index: number) => (
                  <motion.div
                    key={transaction._id}
                    className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                    custom={index}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0 ${
                          transaction.type === "credit"
                            ? "bg-emerald-100"
                            : transaction.type === "debit"
                            ? "bg-rose-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                              {transaction.description}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center sm:block justify-between gap-2">
                            <span
                              className={`font-semibold text-base sm:text-lg ${getTransactionColor(
                                transaction.type
                              )}`}
                            >
                              {transaction.type === "credit" ||
                              transaction.type === "re-fund"
                                ? "+"
                                : "-"}
                              ₹{transaction.amount.toFixed(2)}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                transaction.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : transaction.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <FaHistory className="mx-auto text-3xl sm:text-4xl text-gray-300 mb-3 sm:mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">
                No transactions found
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="mt-3 sm:mt-4 text-[#a58e77] hover:underline text-sm sm:text-base"
                >
                  View all transactions
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Wallet;

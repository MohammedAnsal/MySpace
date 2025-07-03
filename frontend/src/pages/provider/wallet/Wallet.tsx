import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  useProviderWallet,
  useWalletTransactions,
} from "@/hooks/provider/wallet/useWallet";
import {
  Wallet as WalletIcon,
  CreditCard,
  ArrowDownRight,
  ArrowUpRight,
  History,
  Info,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import Loading from "@/components/global/Loading";

interface Transaction {
  _id: string;
  amount: number;
  type: "credit" | "debit" | "re-fund";
  status: "completed" | "pending" | "failed";
  description: string;
  created_at: string;
}

export const Wallet: React.FC = () => {
  const { data: wallet, isLoading: isWalletLoading } = useProviderWallet();
  const { isLoading: isTransactionsLoading } = useWalletTransactions();
  const [activeTab, setActiveTab] = useState<"transactions" | "info">(
    "transactions"
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
  });

  useEffect(() => {
    if (wallet?.transactions?.length) {
      let filtered = [...wallet.transactions].reverse();

      if (filters.type !== "all") {
        filtered = filtered.filter((t) => t.type === filters.type);
      }

      if (filters.status !== "all") {
        filtered = filtered.filter((t) => t.status === filters.status);
      }

      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions([]);
    }
  }, [wallet, filters]);

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
      transition: { duration: 0.3, delay: 0.05 + i * 0.03 },
    }),
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "Invalid date";
      }
      return format(date, "MMM dd, yyyy • h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "credit":
        return <ArrowDownRight className="text-green-500" />;
      case "debit":
        return <ArrowUpRight className="text-red-500" />;
      case "re-fund":
        return <CreditCard className="text-blue-500" />;
      default:
        return <History className="text-gray-500" />;
    }
  };

  // const handleDownloadStatement = () => {
  //   toast.info("Statement download functionality will be available soon.");
  // };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
          <Loading text="Loading wallet..." color="#FFB300" />
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
        <WalletIcon className="mx-auto text-5xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Wallet Not Found
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Your wallet will be created automatically when you receive your first
          booking payment.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
        <p className="text-gray-600">
          Track your earnings and transaction history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-gradient-to-r from-amber-400 to-amber-300 rounded-2xl p-6 text-white shadow-lg col-span-1 lg:col-span-2"
          variants={cardVariants}
        >
          <div className="flex items-center mb-2">
            <WalletIcon className="text-2xl mr-2" />
            <h2 className="text-2xl font-semibold">Provider Wallet</h2>
          </div>
          <div className="mt-6">
            <p className="text-sm opacity-90">Available Balance</p>
            <h1 className="text-4xl font-bold mt-1">
              ₹{wallet.balance.toFixed(2)}
            </h1>
            <p className="text-sm opacity-80 mt-2">
              You receive 70% of each booking amount
            </p>
          </div>
          <div className="mt-6 flex justify-end"></div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-md"
          variants={cardVariants}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Quick Stats
          </h3>
          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(wallet.balance || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transaction Count</p>
              <p className="text-2xl font-bold text-gray-900">
                {wallet.transactions?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Transaction</p>
              <p className="text-lg font-semibold text-gray-900">
                {wallet.transactions && wallet.transactions.length > 0
                  ? formatDate(wallet.transactions[0].created_at)
                  : "No transactions yet"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="flex border-b overflow-x-auto">
          <button
            className={`py-4 px-6 text-center font-medium whitespace-nowrap ${
              activeTab === "transactions"
                ? "text-amber-600 border-b-2 border-amber-400"
                : "text-gray-500 hover:text-amber-500"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            <span className="flex items-center justify-center">
              <History size={18} className="mr-2" /> Transactions
            </span>
          </button>
          <button
            className={`py-4 px-6 text-center font-medium whitespace-nowrap ${
              activeTab === "info"
                ? "text-amber-600 border-b-2 border-amber-400"
                : "text-gray-500 hover:text-amber-500"
            }`}
            onClick={() => setActiveTab("info")}
          >
            <span className="flex items-center justify-center">
              <Info size={18} className="mr-2" /> How It Works
            </span>
          </button>
        </div>

        {activeTab === "transactions" && (
          <div className="p-4">
            {isTransactionsLoading ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading transactions...</p>
              </div>
            ) : wallet.transactions && wallet.transactions.length > 0 ? (
              <>
                {/* Filters */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center">
                    <Filter size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      Filters:
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <select
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                      value={filters.type}
                      onChange={(e) => {
                        setFilters({ ...filters, type: e.target.value });
                        setCurrentPage(1);
                      }}
                    >
                      <option value="all">All Types</option>
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                      <option value="re-fund">Refund</option>
                    </select>

                    <select
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                      value={filters.status}
                      onChange={(e) => {
                        setFilters({ ...filters, status: e.target.value });
                        setCurrentPage(1);
                      }}
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>

                    <select
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                    </select>
                  </div>
                </div>

                {/* Mobile view for small screens */}
                <div className="block md:hidden">
                  {currentItems.length > 0 ? (
                    <div className="space-y-4">
                      {currentItems.map(
                        (transaction: Transaction, index: number) => (
                          <motion.div
                            key={transaction._id}
                            custom={index}
                            variants={itemVariants}
                            initial="initial"
                            animate="animate"
                            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`${
                                    transaction.type === "credit"
                                      ? "text-green-500"
                                      : transaction.type === "debit"
                                      ? "text-red-500"
                                      : "text-blue-500"
                                  }`}
                                >
                                  {getTransactionIcon(transaction.type)}
                                </span>
                                <span className="font-medium text-gray-900 capitalize">
                                  {transaction.type}
                                </span>
                              </div>
                              <span
                                className={`font-semibold ${
                                  transaction.type === "credit"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {transaction.type === "credit" ? "+" : "-"}₹
                                {transaction.amount.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 mb-2">
                              {transaction.description}
                            </p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>{formatDate(transaction.created_at)}</span>
                              <span
                                className={`px-2 py-1 rounded-full ${
                                  transaction.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {transaction.status}
                              </span>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">
                        No transactions match your filters
                      </p>
                    </div>
                  )}
                </div>

                {/* Desktop view for medium and larger screens */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length > 0 ? (
                        currentItems.map(
                          (transaction: Transaction, index: number) => (
                            <motion.tr
                              key={transaction._id}
                              custom={index}
                              variants={itemVariants}
                              initial="initial"
                              animate="animate"
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {transaction.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(transaction.created_at)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span
                                    className={`mr-2 ${
                                      transaction.type === "credit"
                                        ? "text-green-500"
                                        : transaction.type === "debit"
                                        ? "text-red-500"
                                        : "text-blue-500"
                                    }`}
                                  >
                                    {getTransactionIcon(transaction.type)}
                                  </span>
                                  <span className="text-sm text-gray-900 capitalize">
                                    {transaction.type}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    transaction.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : transaction.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {transaction.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                <span
                                  className={`${
                                    transaction.type === "credit"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {transaction.type === "credit" ? "+" : "-"}₹
                                  {transaction.amount.toFixed(2)}
                                </span>
                              </td>
                            </motion.tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            No transactions match your filters
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredTransactions.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 mt-4">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-medium">
                            {indexOfFirstItem + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(
                              indexOfLastItem,
                              filteredTransactions.length
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {filteredTransactions.length}
                          </span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                              currentPage === 1
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((page) => {
                              // Only show first, last, and pages around current
                              if (totalPages <= 7) return true;
                              if (page === 1 || page === totalPages)
                                return true;
                              if (
                                page >= currentPage - 1 &&
                                page <= currentPage + 1
                              )
                                return true;
                              return false;
                            })
                            .map((page, i, arr) => {
                              // Add ellipsis where needed
                              if (i > 0 && arr[i - 1] !== page - 1) {
                                return (
                                  <span
                                    key={`ellipsis-${page}`}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                  >
                                    ...
                                  </span>
                                );
                              }

                              return (
                                <button
                                  key={page}
                                  onClick={() => paginate(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    page === currentPage
                                      ? "z-10 bg-amber-50 border-amber-500 text-amber-600"
                                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            })}

                          <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                              currentPage === totalPages
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <span className="sr-only">Next</span>
                            <ChevronRight
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>
                        </nav>
                      </div>
                    </div>

                    {/* Mobile pagination */}
                    <div className="flex items-center justify-between w-full sm:hidden">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                          currentPage === 1
                            ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                            : "text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                          currentPage === totalPages
                            ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                            : "text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <History className="mx-auto text-3xl text-gray-300 mb-3" />
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Transactions will appear here when you receive booking
                  payments
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "info" && (
          <motion.div
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <Info size={20} className="mr-2 text-amber-500" />
              How Your Provider Wallet Works
            </h3>
            <div className="space-y-5 text-gray-600">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                  <CircleDollarSign size={18} className="mr-2" />
                  Revenue Distribution
                </h4>
                <p className="text-amber-700">
                  When a user books your hostel, the payment is automatically
                  distributed with 70% going to you and 30% retained as platform
                  commission.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Automatic Earnings
                </h4>
                <p>
                  Each time a user makes a successful booking payment, your
                  wallet is automatically credited with 70% of the payment
                  amount.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Transaction Records
                </h4>
                <p>
                  All your earnings are recorded in the transactions tab,
                  showing details like amount, date, and booking reference.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Payment Types
                </h4>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>
                    <span className="text-green-600 font-medium">Credit:</span>{" "}
                    Payments received from bookings
                  </li>
                  <li>
                    <span className="text-blue-600 font-medium">Refund:</span>{" "}
                    Refunds processed for cancellations
                  </li>
                  <li>
                    <span className="text-red-600 font-medium">Debit:</span>{" "}
                    Withdrawals or adjustments
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Withdrawals Coming Soon
                </h4>
                <p>
                  In the future, you'll be able to withdraw funds directly to
                  your bank account. This feature is coming soon.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Wallet;

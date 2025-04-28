import React, { useState } from "react";
import {
  FileText,
  Download,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
  _id: string;
  amount: number;
  type: "credit" | "debit";
  status: "completed" | "pending" | "failed";
  description: string;
  bookingId?: string;
  createdAt: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  walletBalance: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  walletBalance,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const tableVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Filter transactions based on all criteria
  const getFilteredTransactions = () => {
    return transactions.filter((transaction) => {
      const matchesStatus =
        filterStatus === "all" || transaction.status === filterStatus;
      const matchesType =
        filterType === "all" || transaction.type === filterType;
      const matchesSearch =
        searchTerm === "" ||
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.bookingId &&
          transaction.bookingId
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      return matchesStatus && matchesType && matchesSearch;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  // Status badge style
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[#C8ED4F]/20 text-[#C8ED4F]";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "failed":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadTransactionsCSV = () => {
    if (!transactions.length) {
      return;
    }

    // Create CSV header and rows
    const headers = [
      "ID",
      "Date",
      "Description",
      "Amount",
      "Type",
      "Status",
      "Booking ID",
    ];
    const rows = transactions.map((tx) => [
      tx._id,
      new Date(tx.createdAt).toLocaleDateString(),
      tx.description,
      tx.amount.toFixed(2),
      tx.type,
      tx.status,
      tx.bookingId || "N/A",
    ]);

    // Combine header and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `admin-wallet-transactions-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div className="p-6" variants={tableVariants}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FileText className="mr-2 text-[#C8ED4F]" size={20} />
          Transaction History
        </h3>
        <button
          onClick={downloadTransactionsCSV}
          className="flex items-center px-3 py-1.5 bg-[#C8ED4F]/10 text-[#C8ED4F] rounded-lg text-sm hover:bg-[#C8ED4F]/20 transition-colors"
        >
          <Download size={16} className="mr-1" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-[#2A2B2F] p-4 rounded-lg border border-gray-700">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full bg-[#3A3B3F] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8ED4F] focus:border-[#C8ED4F] text-white"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <Filter size={16} className="text-gray-400 mr-2" />
            <select
              className="px-3 py-2 bg-[#3A3B3F] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8ED4F] focus:border-[#C8ED4F]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-center">
            <select
              className="px-3 py-2 bg-[#3A3B3F] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8ED4F] focus:border-[#C8ED4F]"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        {currentTransactions.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#2A2B2F]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#3A3B3F] divide-y divide-gray-700">
              {currentTransactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="hover:bg-[#2A2B2F] transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-200">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`mr-2 ${
                          transaction.type === "credit"
                            ? "text-[#C8ED4F]"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowDownRight size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </span>
                      <span className="text-sm text-gray-300 capitalize">
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <span
                      className={`${
                        transaction.type === "credit"
                          ? "text-[#C8ED4F]"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 bg-[#2A2B2F]/50 rounded-lg border border-gray-700">
            <History className="mx-auto text-gray-600 mb-3 h-12 w-12" />
            <p className="text-gray-300">
              No transactions match your filters
            </p>
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterType("all");
                setSearchTerm("");
              }}
              className="mt-3 px-4 py-2 bg-[#C8ED4F]/10 text-[#C8ED4F] text-sm rounded-lg hover:bg-[#C8ED4F]/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-700 px-4 py-3 mt-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing{" "}
                <span className="font-medium text-white">
                  {Math.min(
                    filteredTransactions.length,
                    indexOfFirstItem + 1
                  )}
                </span>{" "}
                to{" "}
                <span className="font-medium text-white">
                  {Math.min(filteredTransactions.length, indexOfLastItem)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-white">
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
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-[#2A2B2F] text-sm font-medium text-gray-400 hover:bg-[#3A3B3F] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }).map(
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === pageNum
                            ? "z-10 bg-[#C8ED4F]/20 border-[#C8ED4F] text-[#C8ED4F]"
                            : "bg-[#2A2B2F] border-gray-600 text-gray-400 hover:bg-[#3A3B3F]"
                        } text-sm font-medium`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-[#2A2B2F] text-sm font-medium text-gray-400 hover:bg-[#3A3B3F] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile pagination */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-600 bg-[#2A2B2F] text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-gray-300 hover:bg-[#3A3B3F]"
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 bg-[#2A2B2F] text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-gray-300 hover:bg-[#3A3B3F]"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionHistory; 
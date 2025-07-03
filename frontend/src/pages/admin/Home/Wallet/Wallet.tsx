import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useAdminWallet } from "@/hooks/admin/useAdminQueries";
import { motion } from "framer-motion";
import { getAdminDashboard } from "@/services/Api/admin/adminApi";

// Import all components
import WalletHeader from "./components/WalletHeader";
import WalletSummary from "./components/WalletSummary";
import WalletStats from "./components/WalletStats";
import TransactionHistory from "./components/TransactionHistory";
import WalletInfo from "./components/WalletInfo";
import Loading from "@/components/global/loading";

export const Wallet = () => {
  const {
    data: walletData,
    isLoading: loading,
    error: fetchError,
    refetch,
  } = useAdminWallet();
  const [error, setError] = useState<string | null>(null);
  // const [filterStatus, setFilterStatus] = useState<string>("all");
  // const [filterType, setFilterType] = useState<string>("all");
  // const [searchTerm, setSearchTerm] = useState<string>("");
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"transactions" | "info">(
    "transactions"
  );
  const [summaryData, setSummaryData] = useState({
    currentMonthCredits: 0,
    currentMonthDebits: 0,
    pendingTransactions: 0,
  });
  const [dashboardData, setDashboardData] = useState({
    totalBookingRevenue: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    if (fetchError) {
      setError(fetchError.message || "Failed to fetch wallet data");
    } else {
      setError(null);
    }
  }, [fetchError]);

  useEffect(() => {
    if (walletData) {
      calculateSummaryData();
    }
  }, [walletData]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getAdminDashboard();
        if (response) {
          setDashboardData({
            totalBookingRevenue: response.totalRevenue || 0,
            totalBookings: response.bookings || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const calculateSummaryData = () => {
    if (!walletData) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter transactions for current month
    const thisMonthTransactions = walletData.transactions.filter((tx) => {
      const txDate = new Date(tx.created_at);
      return (
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      );
    });

    // Calculate totals
    const currentMonthCredits = thisMonthTransactions
      .filter((tx) => tx.type === "credit" && tx.status === "completed")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const currentMonthDebits = thisMonthTransactions
      .filter((tx) => tx.type === "debit" && tx.status === "completed")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const pendingTransactions = walletData.transactions.filter(
      (tx) => tx.status === "pending"
    ).length;

    setSummaryData({
      currentMonthCredits,
      currentMonthDebits,
      pendingTransactions,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-[#2A2B2F] text-white">
        <div className="flex flex-col items-center">
          <div className="col-span-2 lg:col-span-5 flex justify-center items-center py-8">
            <Loading
              text="Loading wallet..."
              color="#6366f1"
              className="text-white"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#2A2B2F]/90 p-4 rounded-lg border border-red-800 flex items-start text-white">
        <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-red-400 font-medium">Error Loading Wallet</h3>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-3 py-1.5 bg-red-900/50 text-red-300 rounded text-sm font-medium hover:bg-red-900/70 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalCredits =
    walletData?.transactions
      .filter((t) => t.type === "credit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

  // const totalDebits =
  //   walletData?.transactions
  //     .filter((t) => t.type === "debit" && t.status === "completed")
  //     .reduce((sum, t) => sum + t.amount, 0) || 0;

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // const cardVariants = {
  //   initial: { opacity: 0, scale: 0.95 },
  //   animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  // };

  // const tableVariants = {
  //   initial: { opacity: 0, y: 10 },
  //   animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  // };

  // Get first transaction date for stats
  const getFirstTransactionDate = () => {
    if (!walletData?.transactions.length) return "No transactions";

    const firstTransaction = walletData.transactions.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )[0];

    return new Date(firstTransaction.created_at).toLocaleDateString();
  };

  return (
    <motion.div
      className="p-6 space-y-6 bg-[#2A2B2F] text-white min-h-screen"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      {/* Header Component */}
      <WalletHeader />

      {/* Wallet Summary Component */}
      <WalletSummary
        walletBalance={walletData?.balance || 0}
        totalCredits={totalCredits}
        totalBookingRevenue={dashboardData.totalBookingRevenue}
        transactionCount={walletData?.transactions?.length || 0}
        pendingTransactions={summaryData.pendingTransactions}
      />

      {/* Stats Component */}
      <WalletStats
        firstTransactionDate={getFirstTransactionDate()}
        totalBookings={dashboardData.totalBookings}
        currentMonthCredits={summaryData.currentMonthCredits}
        currentMonthDebits={summaryData.currentMonthDebits}
      />

      {/* Transactions Section */}
      <div className="bg-[#3A3B3F] rounded-xl overflow-hidden border border-gray-700 shadow-lg">
        <div className="flex border-b border-gray-700 overflow-x-auto">
          <button
            className={`py-4 px-6 text-center font-medium whitespace-nowrap ${
              activeTab === "transactions"
                ? "text-[#C8ED4F] border-b-2 border-[#C8ED4F]"
                : "text-gray-400 hover:text-[#C8ED4F]/70"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            <span className="flex items-center justify-center">
              Transactions
            </span>
          </button>
          <button
            className={`py-4 px-6 text-center font-medium whitespace-nowrap ${
              activeTab === "info"
                ? "text-[#C8ED4F] border-b-2 border-[#C8ED4F]"
                : "text-gray-400 hover:text-[#C8ED4F]/70"
            }`}
            onClick={() => setActiveTab("info")}
          >
            <span className="flex items-center justify-center">
              Information
            </span>
          </button>
        </div>

        {activeTab === "transactions" && (
          <TransactionHistory
            transactions={walletData?.transactions || []}
            walletBalance={walletData?.balance || 0}
          />
        )}

        {activeTab === "info" && <WalletInfo />}
      </div>
    </motion.div>
  );
};

export default Wallet;

import { Users, Hotel, Calendar, DollarSign } from "lucide-react";
import { useAdminDashboard } from "@/hooks/admin/useAdminQueries";
import Loading from "@/components/global/Loading";
import RevenueAnalytics from "@/pages/admin/Home/Dashboard/components/RevenueAnalytics";
import DistributionChart from "@/pages/admin/Home/Dashboard/components/DistributionChart";
import { motion } from "framer-motion";

interface Metric {
  title: string;
  count: number | string;
  color: string;
  icon: JSX.Element;
}

const Dashboard = () => {
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useAdminDashboard();

  const formatCurrency = (value: number) => {
    return "₹" + value.toLocaleString("en-US");
  };

  const metrics: Metric[] = [
    {
      title: "Users",
      count: dashboardData?.users || 0,
      color: "bg-blue-500",
      icon: <Users size={20} color="white" />,
    },
    {
      title: "Providers",
      count: dashboardData?.providers || 0,
      color: "bg-purple-500",
      icon: <Users size={20} color="white" />,
    },
    {
      title: "Hostels",
      count: dashboardData?.hostels || 0,
      color: "bg-green-500",
      icon: <Hotel size={20} color="white" />,
    },
    {
      title: "Total Revenue",
      count: dashboardData?.totalRevenue
        ? formatCurrency(dashboardData.totalRevenue)
        : "₹0",
      color: "bg-[#C8ED4F]",
      icon: <DollarSign size={20} color="#242529" />,
    },
    {
      title: "Bookings",
      count: dashboardData?.bookings || 0,
      color: "bg-red-500",
      icon: <Calendar size={20} color="white" />,
    },
  ];

  // Distribution data for pie chart
  const distributionData = [
    { name: "Users", value: dashboardData?.users || 0 },
    { name: "Providers", value: dashboardData?.providers || 0 },
    { name: "Hostels", value: dashboardData?.hostels || 0 },
    { name: "Bookings", value: dashboardData?.bookings || 0 },
  ];

  return (
    <div className="w-full min-h-screen bg-[#242529] pb-8">
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Overview of platform analytics and statistics
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2A2B2F] rounded-xl shadow-lg p-6 border border-gray-700"
          >
            <h2 className="text-xl font-medium mb-4 text-white">
              Platform Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {isDashboardLoading ? (
                <div className="col-span-2 lg:col-span-5 flex justify-center items-center py-8">
                  <Loading text="Loading dashboard..." color="#6366f1" className="text-white" />
                </div>
              ) : (
                metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center p-4 rounded-lg border border-gray-700 hover:border-[#C8ED4F]/50 transition-colors bg-[#242529]"
                  >
                    <div
                      className={`${metric.color} w-12 h-12 rounded-full flex items-center justify-center shadow-md mr-4`}
                    >
                      {metric.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-400">
                        {metric.title}
                      </div>
                      <div className="text-xl font-bold text-white">
                        {metric.count}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Charts Section */}
          {!isDashboardLoading && dashboardData?.revenueData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <RevenueAnalytics revenueData={dashboardData.revenueData} />
              <DistributionChart data={distributionData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

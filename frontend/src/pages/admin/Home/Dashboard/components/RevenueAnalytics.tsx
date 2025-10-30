import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface RevenueData {
  weekly: Array<{ week: string; revenue: number }>;
  monthly: Array<{ month: string; revenue: number }>;
  yearly: Array<{ year: number; revenue: number }>;
}

interface RevenueAnalyticsProps {
  revenueData: RevenueData | undefined;
}

const RevenueAnalytics = ({ revenueData }: RevenueAnalyticsProps) => {
  const [activeChart, setActiveChart] = useState<
    "weekly" | "monthly" | "yearly"
  >("monthly");

  const renderChartData = () => {
    if (!revenueData) return [];

    switch (activeChart) {
      case "weekly":
        return revenueData.weekly;
      case "monthly":
        return revenueData.monthly;
      case "yearly":
        return revenueData.yearly;
      default:
        return revenueData.monthly;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-[#2A2B2F] rounded-xl shadow-lg p-6 border border-gray-700 lg:col-span-2"
    >
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4 text-white">
          Revenue Analytics
        </h2>
        <div className="inline-flex p-1 space-x-1 bg-[#242529] rounded-lg">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeChart === "weekly"
                ? "bg-[#C8ED4F] text-[#242529]"
                : "text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setActiveChart("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeChart === "monthly"
                ? "bg-[#C8ED4F] text-[#242529]"
                : "text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setActiveChart("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeChart === "yearly"
                ? "bg-[#C8ED4F] text-[#242529]"
                : "text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setActiveChart("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === "yearly" ? (
            <BarChart
              data={renderChartData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey={
                  activeChart === "yearly"
                    ? "year"
                    : activeChart === "monthly"
                    ? "month"
                    : "week"
                }
                stroke="#ccc"
              />
              <YAxis stroke="#ccc" />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "#2A2B2F",
                  borderRadius: "8px",
                  border: "1px solid #444",
                  color: "#fff",
                }}
                labelStyle={{ color: "#C8ED4F" }}
              />
              <Legend wrapperStyle={{ color: "#ccc" }} />
              <Bar
                dataKey="revenue"
                fill="#C8ED4F"
                name="Revenue"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart
              data={renderChartData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey={activeChart === "monthly" ? "month" : "week"}
                stroke="#ccc"
              />
              <YAxis stroke="#ccc" />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "#2A2B2F",
                  borderRadius: "8px",
                  border: "1px solid #444",
                  color: "#fff",
                }}
                labelStyle={{ color: "#C8ED4F" }}
              />
              <Legend wrapperStyle={{ color: "#ccc" }} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#C8ED4F"
                strokeWidth={2}
                name="Revenue"
                activeDot={{ r: 8, fill: "#C8ED4F" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RevenueAnalytics;

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
    <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Revenue Analytics
        </h2>
        <div className="inline-flex p-1 space-x-1 bg-gray-100 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeChart === "weekly"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveChart("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeChart === "monthly"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveChart("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeChart === "yearly"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey={
                  activeChart === "yearly"
                    ? "year"
                    : activeChart === "monthly"
                    ? "month"
                    : "week"
                }
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Revenue"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#8884d8"
                name="Revenue"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart
              data={renderChartData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={activeChart === "monthly" ? "month" : "week"} />
              <YAxis />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Revenue"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={2}
                name="Revenue"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueAnalytics;

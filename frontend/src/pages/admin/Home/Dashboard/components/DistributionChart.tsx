import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

interface DistributionData {
  name: string;
  value: number;
}

interface DistributionChartProps {
  data: DistributionData[];
}

const DistributionChart = ({ data }: DistributionChartProps) => {
  // Admin UI theme colors matching with the attached file
  const COLORS = [
    "#3b82f6", // blue-500
    "#8b5cf6", // purple-500
    "#10b981", // green-500
    "#C8ED4F", // lime-green from theme
    "#ef4444", // red-500
  ];

  // Custom label for pie chart
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
    name: string;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#2A2B2F] rounded-xl shadow-lg p-6 border border-gray-700"
    >
      <h2 className="text-xl font-medium mb-4 text-white">
        Distribution
      </h2>
      <div className="h-72 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomLabel}
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [value, name]}
              contentStyle={{
                backgroundColor: "#2A2B2F",
                borderRadius: "8px",
                border: "1px solid #444",
                color: "#fff"
              }}
            />
            <Legend wrapperStyle={{ color: "#ccc" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DistributionChart;

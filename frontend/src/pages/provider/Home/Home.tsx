import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/provider/Sidebar";
import { Users, Home, Calendar, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

interface Metric {
  title: string;
  count: number;
  color: string;
  icon: JSX.Element;
}

interface ChartData {
  thisWeek: number[];
  lastWeek: number[];
}

interface HoverInfo {
  month: string;
  thisWeek: number;
  lastWeek: number;
  x: number;
}

interface ChartRect {
  width: number;
  height: number;
}

const ProviderDashboard: React.FC = () => {
    const { fullName } = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<string>("Jul");
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(true);
  const [chartRect, setChartRect] = useState<ChartRect>({ width: 1000, height: 200 });

  const months: string[] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const chartData: ChartData = {
    thisWeek: [4.5, 5.8, 8.2, 6.5, 4.0, 3.5, 5.5, 3.2, 4.7, 7.8, 6.8, 5.5],
    lastWeek: [2.8, 4.2, 5.0, 4.8, 3.2, 2.5, 6.2, 4.8, 3.0, 5.5, 8.5, 7.0],
  };

  const metrics: Metric[] = [
    {
      title: "Users",
      count: 32,
      color: "bg-indigo-600",
      icon: <Users size={20} color="white" />,
    },
    {
      title: "Providers",
      count: 54,
      color: "bg-orange-400",
      icon: <Users size={20} color="white" />,
    },
    {
      title: "Accommodation",
      count: 40,
      color: "bg-yellow-400",
      icon: <Home size={20} color="white" />,
    },
    {
      title: "Bookings",
      count: 30,
      color: "bg-indigo-800",
      icon: <Calendar size={20} color="white" />,
    },
  ];

  const getPath = (dataPoints: number[]): string => {
    const maxValue = 10;
    const width = 1000;
    const height = 200;
    const segmentWidth = width / (dataPoints.length - 1);

    return dataPoints
      .map((point, index) => {
        const x = index * segmentWidth;
        const y = height - (point / maxValue) * height;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  };

  const getAreaPath = (dataPoints: number[]): string => {
    const maxValue = 10;
    const width = 1000;
    const height = 200;
    const segmentWidth = width / (dataPoints.length - 1);

    let path = dataPoints
      .map((point, index) => {
        const x = index * segmentWidth;
        const y = height - (point / maxValue) * height;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

    path += ` L${width},${height} L0,${height} Z`;
    return path;
  };

  const handleMonthClick = (month: string): void => {
    setCurrentMonth(month);
  };

  const handleChartHover = (e: React.MouseEvent<SVGSVGElement>): void => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    setChartRect(svgRect);

    const mouseX = e.clientX - svgRect.left;
    const relativeX = mouseX / svgRect.width;

    const monthIndex = Math.min(Math.floor(relativeX * 12), 11);
    const thisWeekValue = chartData.thisWeek[monthIndex];
    const lastWeekValue = chartData.lastWeek[monthIndex];

    setHoverInfo({
      month: months[monthIndex],
      thisWeek: thisWeekValue,
      lastWeek: lastWeekValue,
      x: mouseX,
    });
  };

  const handleMouseLeave = (): void => {
    setHoverInfo(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden">
        <div className="p-4 lg:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl lg:text-2xl font-medium text-gray-800">MySpace</h1>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/provider/profile")}
            >
              <span className="mr-2 text-gray-800">{fullName}</span>
              <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
                <User size={16} color="white" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div
                      className={`${metric.color} w-10 h-10 rounded-full flex items-center justify-center`}
                    >
                      {metric.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{metric.title}</div>
                      <div className="text-xl lg:text-2xl font-semibold">
                        {metric.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 space-y-4 lg:space-y-0">
                <h2 className="text-lg font-semibold text-gray-800">
                  Accommodation Performance
                </h2>
                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setCompareMode(!compareMode)}
                  >
                    <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                    <span className="text-sm text-gray-500">This Week</span>
                    <span className="ml-2 font-semibold">1,245</span>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setCompareMode(!compareMode)}
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
                    <span className="text-sm text-gray-500">Last Week</span>
                    <span className="ml-2 font-semibold">1,356</span>
                  </div>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="h-64 relative mt-8">
                {/* Y-axis labels */}
                <div className="absolute left-0 h-full flex flex-col justify-between text-xs text-gray-500">
                  <span>10.0</span>
                  <span>7.5</span>
                  <span>5.0</span>
                  <span>2.5</span>
                  <span>0.0</span>
                </div>

                {/* Chart Area */}
                <div className="ml-8 h-full relative overflow-x-auto">
                  <svg
                    className="w-full h-full min-w-[800px]"
                    viewBox="0 0 1000 200"
                    preserveAspectRatio="none"
                    onMouseMove={handleChartHover}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={`grid-${i}`}
                        x1="0"
                        y1={i * 50}
                        x2="1000"
                        y2={i * 50}
                        stroke="#EEEEEE"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Month separators */}
                    {months.map((_, i) => (
                      <line
                        key={`month-${i}`}
                        x1={i * (1000 / 11)}
                        y1="0"
                        x2={i * (1000 / 11)}
                        y2="200"
                        stroke="#EEEEEE"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Yellow Area Fill (This Week) */}
                    {compareMode && (
                      <path
                        d={getAreaPath(chartData.thisWeek)}
                        fill="rgba(253, 224, 71, 0.2)"
                      />
                    )}

                    {/* Yellow Line (This Week) */}
                    {compareMode && (
                      <path
                        d={getPath(chartData.thisWeek)}
                        fill="none"
                        stroke="#F6CD74"
                        strokeWidth="3"
                      />
                    )}

                    {/* Blue Line (Last Week) */}
                    <path
                      d={getPath(chartData.lastWeek)}
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="3"
                    />

                    {/* Current Month Indicator */}
                    <line
                      x1={months.indexOf(currentMonth) * (1000 / 11)}
                      y1="0"
                      x2={months.indexOf(currentMonth) * (1000 / 11)}
                      y2="200"
                      stroke="#CCCCCC"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                    <circle
                      cx={months.indexOf(currentMonth) * (1000 / 11)}
                      cy={
                        200 -
                        (chartData.lastWeek[months.indexOf(currentMonth)] / 10) *
                          200
                      }
                      r="6"
                      fill="#E6BC7E"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />

                    {/* Hover indicator */}
                    {hoverInfo && (
                      <line
                        x1={(hoverInfo.x / chartRect.width) * 1000}
                        y1="0"
                        x2={(hoverInfo.x / chartRect.width) * 1000}
                        y2="200"
                        stroke="#999999"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                      />
                    )}
                  </svg>

                  {/* Hover tooltip */}
                  {hoverInfo && (
                    <div
                      className="absolute bg-white p-2 rounded shadow-md text-xs"
                      style={{
                        left: `${hoverInfo.x}px`,
                        top: "0px",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="font-bold">{hoverInfo.month}</div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>
                        <span>
                          This Week:{" "}
                          {hoverInfo.thisWeek
                            ? hoverInfo.thisWeek.toFixed(1)
                            : "0.0"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></span>
                        <span>
                          Last Week:{" "}
                          {hoverInfo.lastWeek
                            ? hoverInfo.lastWeek.toFixed(1)
                            : "0.0"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* X-axis Month Labels */}
                  <div className="flex justify-between absolute bottom-0 w-full text-xs text-gray-500">
                    {months.map((month, index) => (
                      <span
                        key={index}
                        className={`cursor-pointer hover:text-black transition-colors ${
                          month === currentMonth ? "font-semibold" : ""
                        }`}
                        onClick={() => handleMonthClick(month)}
                      >
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

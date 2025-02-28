import React from 'react';
import { BarChart2, TrendingUp, DollarSign } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-semibold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <DollarSign className="text-green-500" />
          </div>
          <p className="text-3xl font-bold">$24,345</p>
          <p className="text-sm text-green-500 flex items-center mt-2">
            <TrendingUp size={16} className="mr-1" />
            +12.5% from last month
          </p>
        </div>

        {/* Bookings Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Bookings</h3>
            <BarChart2 className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold">156</p>
          <p className="text-sm text-blue-500 flex items-center mt-2">
            <TrendingUp size={16} className="mr-1" />
            +8.2% from last month
          </p>
        </div>

        {/* Average Rating Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Average Rating</h3>
            <span className="text-yellow-400">★</span>
          </div>
          <p className="text-3xl font-bold">4.8</p>
          <p className="text-sm text-yellow-500 mt-2">
            Based on 48 reviews
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Monthly Performance</h2>
        <div className="h-80 flex items-center justify-center border-t">
          <p className="text-gray-500">Chart will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 
import React from 'react';
import Sidebar from '@/components/provider/Sidebar';
import { Outlet } from 'react-router-dom';

const ProviderLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-0 lg:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout; 
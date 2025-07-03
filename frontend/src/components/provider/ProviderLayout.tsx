import React from 'react';
import Sidebar from '@/components/provider/Sidebar';
import { Outlet } from 'react-router-dom';
import { useNotifications } from '@/contexts/notificationContext';

const ProviderLayout: React.FC = () => {
  const { unreadCount } = useNotifications();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar unreadCount={unreadCount} />
      <div className="flex-1 overflow-auto scrollbar-hide">
        <main className="p-0 lg:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout; 
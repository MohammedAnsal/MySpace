import React, { useState } from 'react';
import { Bell, MessageSquare, Calendar, DollarSign, Star, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'booking' | 'message' | 'review' | 'payment';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'New Booking Request',
      message: 'John Doe wants to book Modern Apartment for 5 nights',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      message: 'Sarah Smith: Is the beach house available next weekend?',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'review',
      title: 'New Review',
      message: 'You received a 5-star review for Mountain View Villa',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $450 received for booking #1234',
      time: '1 day ago',
      read: true,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="text-blue-500" />;
      case 'message':
        return <MessageSquare className="text-green-500" />;
      case 'review':
        return <Star className="text-yellow-500" />;
      case 'payment':
        return <DollarSign className="text-purple-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="ml-3 px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-sm">
              {unreadCount} new
            </span>
          )}
        </div>
        
        {notifications.length > 0 && (
          <button
            onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
            className="text-sm text-gray-600 hover:text-amber-500"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm p-4 transition-colors ${
              !notification.read ? 'border-l-4 border-amber-200' : ''
            }`}
          >
            <div className="flex items-start">
              <div className="p-2 rounded-lg bg-gray-50">
                {getIcon(notification.type)}
              </div>
              
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <span className="text-sm text-gray-500 mt-2 block">
                      {notification.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm text-amber-500 hover:text-amber-600"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 
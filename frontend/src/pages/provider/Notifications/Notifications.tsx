import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  MessageSquare,
  Calendar,
  DollarSign,
  Star,
  CheckCircle2,
  Trash2,
} from "lucide-react";

import { useNotifications } from "@/contexts/NotificationContext";

const Notifications: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  } = useNotifications();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: 0.05 + i * 0.03 },
    }),
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "hostel":
        return <Calendar className="text-blue-500" />;
      case "message":
        return <MessageSquare className="text-green-500" />;
      case "update":
        return <Star className="text-yellow-500" />;
      case "alert":
        return <DollarSign className="text-purple-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    // If notification is unread, mark it as read
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    // You can add additional logic here for navigation or other actions
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <p className="text-gray-600">
          Stay updated with your latest activities
        </p>
      </div>

      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden"
        variants={cardVariants}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Bell className="text-amber-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                Your Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <CheckCircle2 size={18} />
                <span>Mark all as read</span>
              </motion.button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                custom={index}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.isRead
                    ? "bg-amber-50/50 border-l-4 border-amber-500"
                    : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-gray-50 relative">
                    {getIcon(notification.type)}
                    {/* Show a small dot for unread notifications */}
                    {!notification.isRead && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3
                          className={`text-lg ${
                            !notification.isRead
                              ? "font-semibold"
                              : "font-medium"
                          } text-gray-900`}
                        >
                          {notification.title}
                        </h3>
                        <p
                          className={`mt-1 ${
                            !notification.isRead
                              ? "text-gray-700"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                        {!notification.isRead && (
                          <p className="mt-1 text-sm text-amber-600 font-medium">
                            {/* Mark as read */}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the notification click
                            deleteNotification(notification._id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No notifications yet</p>
              <p className="text-gray-400 text-sm mt-1">
                We'll notify you when something important happens
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Notifications;

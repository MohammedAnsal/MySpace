import {
  Bell,
  MessageSquare,
  Calendar,
  DollarSign,
  Star,
  X,
} from "lucide-react";
import { useNotifications } from '@/contexts/notificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const Notification = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "hostel":
        return <Calendar className="text-[#b9a089]" />;
      case "message":
        return <MessageSquare className="text-[#b9a089]" />;
      case "update":
        return <Star className="text-[#b9a089]" />;
      case "alert":
        return <DollarSign className="text-[#b9a089]" />;
      default:
        return <Bell className="text-[#b9a089]" />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-white rounded-lg mt-4 shadow-lg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-dm_sans text-[#b9a089]">Notifications</h2>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-[#b9a089]/10 text-[#b9a089] rounded-full text-sm font-medium"
            >
              {unreadCount} new
            </motion.span>
          )}
        </div>
        {notifications.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={markAllAsRead}
            className="text-sm text-[#b9a089] hover:text-[#b9a089]/80 transition-colors font-dm_sans"
          >
            Mark all as read
          </motion.button>
        )}
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence>
          {notifications.map((notification, idx) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className={`group bg-white rounded-lg p-4 transition-all duration-300
                ${!notification.isRead 
                  ? "border-l-4 border-[#b9a089] shadow-md" 
                  : "border border-gray-100 hover:shadow-md"
                }`}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="p-3 rounded-lg bg-[#b9a089]/10 group-hover:bg-[#b9a089]/20 transition-colors"
                >
                  {getIcon(notification.type)}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-dm_sans text-lg text-gray-800 font-medium">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 mt-1 font-dm_sans">
                        {notification.message}
                      </p>
                      <span className="text-sm text-gray-400 mt-2 block font-dm_sans">
                        {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {!notification.isRead && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => markAsRead(notification._id)}
                          className="text-sm text-[#b9a089] hover:text-[#b9a089]/80 font-dm_sans"
                        >
                          Mark as read
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteNotification(notification._id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <X size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
              {idx < notifications.length - 1 && (
                <div className="mt-4 border-t border-dashed border-gray-100" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Bell size={64} className="text-[#b9a089]/30 mb-6" />
            </motion.div>
            <h3 className="text-xl font-dm_sans text-[#b9a089] font-medium mb-2">
              No notifications
            </h3>
            <p className="text-gray-400 text-center font-dm_sans">
              You're all caught up!<br />
              We'll notify you when something arrives.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notification;

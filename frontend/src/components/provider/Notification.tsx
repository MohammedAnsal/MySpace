import { useNotification } from "@/hooks/notification/useNotification";
import { useEffect, useState } from "react";

const Notification = () => {
  const { loading, error, getNotificationsByRecipient } = useNotification();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotificationsByRecipient("providerId");
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Provider Notifications</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <button>Mark as Read</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;

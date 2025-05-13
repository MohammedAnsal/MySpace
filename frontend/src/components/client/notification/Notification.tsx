import { useNotification } from "../../../hooks/notification/useNotification";
import { useEffect, useState } from "react";

const Notification = () => {
  const { loading, error, getNotificationsByRecipient } = useNotification();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotificationsByRecipient("currentUserId"); 
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Your Notifications</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;

import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function NotificationPanel() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    Promise.all([api.getNotifications(), api.getUnreadCount()])
      .then(([items, unread]) => {
        setNotifications(items);
        setCount(unread.count);
      })
      .catch((err) => setError(err.message));
    return undefined;
  }, [user]);

  async function markAllRead() {
    try {
      await api.markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      setCount(0);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Live Inbox</p>
          <h2>{count} unread</h2>
        </div>
        <button type="button" onClick={markAllRead}>
          Mark all read
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <div className="notification-list">
        {notifications.map((notification) => (
          <article className={`notification-card ${notification.read ? "read" : ""}`} key={notification.id}>
            <span className="badge">{notification.type.replaceAll("_", " ")}</span>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
          </article>
        ))}
        {!notifications.length && !error ? <p className="muted">No notifications yet.</p> : null}
      </div>
    </section>
  );
}

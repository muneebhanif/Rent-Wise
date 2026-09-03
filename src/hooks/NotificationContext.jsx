
// use --> useContext(NotificationContext) to access details

import { createContext, useState, useEffect } from "react";
 import { getNotifications, readAllNotifications, clearAllNotifications, readOneNotification } from "../Api/Notification";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch existing notifications from backend on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        const fetchedNotifications = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        setNotifications(fetchedNotifications);
        const count = fetchedNotifications.filter((n) => !n.isRead).length;
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);
  useEffect(() => {
    const handlePushMessage = (event) => {
      setUnreadCount(unreadCount + 1);
      setNotifications((prev) => {
        const exists = prev.some(
          (notif) => notif._id === event.data._id // Use `_id` instead of `title` and `message`
        );
        if (!exists) {
          return [event.data, ...prev]; // Add the new notification to the beginning of the list
        }
        return prev; // Return the previous state if the notification already exists
      });
    };
  
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        navigator.serviceWorker.removeEventListener("message", handlePushMessage); 
        navigator.serviceWorker.addEventListener("message", handlePushMessage);
      }).catch((error) => {
        console.error("Service Worker is not ready:", error);
      });
    }
  
    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handlePushMessage); // Cleanup on unmount
      }
    };
  }, []);
  const markAllAsRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
      const response = await readAllNotifications();
    } catch (error) {
      console.error("Service Worker is not ready:", error);
    }
  };

  const clearAll = async () => {
    try {
      setNotifications([]);
      setUnreadCount(0);
      const response = await clearAllNotifications();
    } catch (error) {
      console.error("Service Worker is not ready:", error);
    }
  };

  const deleteRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
  };

  const toggleRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );

      setUnreadCount((prevCount) => {
        const notification = notifications.find((n) => n._id === id);
        if (notification && !notification.isRead) {
          return prevCount - 1;
        }
        return prevCount;
      });

      const response = await readOneNotification(id);
    } catch (error) {
      console.error("Service Worker is not ready:", error);
    }
  };

  const contextValue = {
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    markAllAsRead,
    clearAll,
    deleteRead,
    toggleRead,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

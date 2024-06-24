import { useState, useEffect } from "react";
import axios from "axios";
import { useAdminNotificationContext } from "../../../hooks/useAdminNotificationContext";
import { FiUser, FiAlertCircle, FiBell } from "react-icons/fi";
import { formatDistanceToNow, format } from "date-fns";
import { Link } from "react-router-dom";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { dispatch, unreadNotifications } = useAdminNotificationContext();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}admin/notifications/`
        );
        setNotifications(response.data);

        const unread = response.data.filter(
          (notification) => !notification.is_read
        );
        dispatch({ type: "UPDATE_UNREAD_NOTIFICATIONS", payload: unread });
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, [dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case "company_register":
        return <FiUser className="text-purple-700 w-6 h-6" />;
      case "subscription":
        return <FiBell className="text-blue-700 w-6 h-6" />;
      default:
        return <FiAlertCircle className="text-red-500 w-6 h-6" />;
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}admin/notifications/${id}/read/`
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );

      const unread = unreadNotifications.filter(
        (notification) => notification.id !== id
      );
      dispatch({ type: "UPDATE_UNREAD_NOTIFICATIONS", payload: unread });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  return (
    <>
      <div className="flex pt-10 mb-12 px-4">
        <ul className="bg-slate-900 border border-gray-700 rounded-full py-2 px-4 -space-x-4 w-max flex items-center mt-4">
          <li className="bg-gray-800 text-purple-500 hover:underline rounded-full z-40 px-8 py-3 text-base cursor-pointer">
            <Link to="/admin-dash?tab=dash">Dashboard</Link>
          </li>
          <li className="bg-purple-600 text-white underline rounded-r-full z-10 px-8 py-3 text-base cursor-pointer">
            <Link to="/admin-dash?tab=notifications">Notifications</Link>
          </li>
        </ul>
      </div>

      <div className="max-w-screen-2xl mx-auto lg:py-14 py-10 px-4">
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`flex items-start p-4 rounded-lg border border-gray-700 ${
                notification.is_read
                  ? "bg-transparent hover:bg-gray-700"
                  : "bg-gray-800 hover:bg-gray-700"
              } shadow-sm shadow-gray-800`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex-shrink-0">{getIcon(notification.type)}</div>
              <div className="ml-4 flex-grow">
                <p className="text-white">{notification.message}</p>
                <p className="text-sm text-white">
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="text-sm text-white ml-10">
                <p>
                  {format(new Date(notification.created_at), "d MMM, yyyy")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Notification;

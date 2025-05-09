import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { Bell, CircleUser } from "lucide-react";
import { RootState } from "../store/store";
import { useSocket } from "../hook/useSocket";
import { useEffect, useState } from "react";
import { updateNotification } from "../api";
import { cn } from "../lib/utils";
import { isVisible } from "@testing-library/user-event/dist/utils";
import { setSidebar } from "../store/slices/sidebar";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.users.user);
  const { notifications, setNotifications } = useSocket(user?.userId || "");
  const [unreadCount, setUnreadCount] = useState(0);
  const visible = useSelector((state: RootState) => state.sidebar);

  // handle mark as read
  const handleMarkAsRead = async (notificationId: string) => {
    await updateNotification(notificationId);

    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification,
    );
    setNotifications(updatedNotifications);
  };

  useEffect(() => {
    const count = notifications.filter((n) => !n.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/sign-in");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
  ];

  console.log("Notifications", notifications);
  return (
    <>
      <div
        className={cn(
          "fixed left-0 top-0 z-10 hidden h-screen w-screen bg-black/30",
          visible && "block",
        )}
        onClick={() => dispatch(setSidebar(false))}
      ></div>
      <div className="sticky top-0 isolate flex h-20 w-full items-center justify-between bg-white px-5 py-3">
        {/* Notification sidebar */}
        <div
          className={cn(
            "fixed right-0 top-0 z-[500] h-screen w-80 bg-neutral-100 transition-transform duration-300",
            visible ? "translate-x-0" : "translate-x-full",
          )}
        >
          <ul className="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-auto border-l border-neutral-300 bg-white p-4">
            {notifications &&
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`cursor-pointer px-2 py-4 text-neutral-700 ${notification.isRead ? "bg-white" : "bg-gray-100"}`}
                >
                  {notification.message}{" "}
                  <span
                    className={`ms-3 text-sm italic text-neutral-400 ${notification.isRead ? "hidden" : ""}`}
                  >
                    mark as read
                  </span>
                </li>
              ))}
          </ul>
        </div>
        <div className="text-2xl font-bold text-neutral-700">TODO</div>
        <nav className="flex items-center gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `border-blue-300 px-3 py-1 hover:border-b-2 hover:text-blue-600 ${isActive ? "font-medium text-blue-600" : "text-gray-600"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-base text-red-600 hover:border-b-2 hover:border-red-300 hover:text-red-800"
          >
            Logout
          </button>
          <div
            className="relative cursor-pointer"
            onClick={() => dispatch(setSidebar(!visible))}
          >
            <p className="absolute -top-2 right-0 text-sm font-semibold text-blue-500">
              {unreadCount}
            </p>
            <Bell className="text-neutral-600" />
          </div>
          <div className="flex items-center gap-2">
            <CircleUser className="text-gray-600" />
            <p>{user?.username}</p>
          </div>
        </nav>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getNotifications } from "../api";

export interface Notification {
  id: string;
  createdAt: Date;
  taskId: string;
  type: "assignment" | "update" | "reminder";
  userId: string;
  message: string;
  isRead: boolean;
}

export function useSocket(userId: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!useSocket) return;

    const fetchInitialNotifications = async () => {
      try {
        const initialNotifications: any = await getNotifications();
        setNotifications(initialNotifications.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const newSocket = io(
      process.env.REACT_APP_SERVER_URL || "http://localhost:4000",
      // {
      //   auth: {
      //     token: localStorage.getItem("token"),
      //   },
      // },
    );
    setSocket(newSocket);
    // Fetch existing notifications
    fetchInitialNotifications();

    // client-side
    newSocket.on("connect", () => {
      console.log(newSocket.id); // x8WIv7-mJelg7on_ALbx
    });

    //   join user specific room
    newSocket.emit("join-user-room", userId);

    newSocket.on("new-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return { socket, notifications, setNotifications };
}

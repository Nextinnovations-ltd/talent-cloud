/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminSideBar from "@/components/nav/admin/AdminSideBar";
import NotificationDropDown from "@/components/notifications/notificationDropDown";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import useToast from "@/hooks/use-toast";
import {
  useGetJobSeekerNotificationsQuery,
  useGetUnReadNotificationsCountQuery,
} from "@/services/slices/notificationSlice";
import { createReconnectingWebSocket } from "@/lib/reconnectingWebSocket";

const AdminLayout = () => {
  const token = useSelector((state: any) => state.auth.token);
  const socketRef = useRef<ReturnType<typeof createReconnectingWebSocket> | null>(null);
  const [_messages, setMessages] = useState<string[]>([]);
  const { showNotification } = useToast();

  const { refetch } = useGetUnReadNotificationsCountQuery();
  const { refetch: refetchIsRead } = useGetJobSeekerNotificationsQuery({
    limit: 10,
    offset: 0,
  });

  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Stable refetch handler
  const handleRefetch = useCallback(() => {
    refetch();
    refetchIsRead();
  }, [refetch, refetchIsRead]);

  useEffect(() => {
    if (!token) return;

    // Request notification permission once
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Clean up existing socket connection before creating a new one
    if (socketRef.current) {
      socketRef.current.clearListeners();
      socketRef.current.close();
      socketRef.current = null;
    }

    const socket = createReconnectingWebSocket({
      makeUrl: () => `ws://staging.talent-cloud.asia/ws/notifications/?token=${token}`,
      initialBackoffMs: 1000,
      maxBackoffMs: 30000,
      heartbeatMs: 30000,
    });

    socketRef.current = socket;

    socket.onOpen(() => {
      console.log("✅ WebSocket connected");
    });

    socket.onMessage((event) => {
      try {
        const data = JSON.parse(event.data as string);

        if (data.type === "notification") {
          setMessages((prev) => [...prev, data.message]);

          // Toast notification
          showNotification({
            message: data.message,
            type: "success",
          });

          // Trigger immediate refetch
          handleRefetch();

          // Browser notification
          if (Notification.permission === "granted") {
            new Notification("Talent Cloud", {
              body: data.message,
              icon: "./talent_logo.svg",
            });
          }
        }
      } catch (err) {
        console.error("❌ Failed to parse WebSocket message", err);
      }
    });

    socket.onClose(() => {
      console.log("❌ WebSocket disconnected");
    });

    // Cleanup on unmount or token change
    return () => {
      if (socketRef.current) {
        socketRef.current.clearListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [token]); // Only depend on token to prevent unnecessary reconnections

  return (
    <div>
      <AdminSideBar />
      <div className="ml-[263px] min-h-screen">
        {/* Sticky Header */}
        <div className="bg-white flex items-center justify-end pr-5 border-b border-b-[#F2F2F2] z-50 w-full h-[70px] sticky top-0">
          <NotificationDropDown />
        </div>

        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

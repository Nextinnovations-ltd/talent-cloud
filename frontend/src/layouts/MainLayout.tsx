/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavBar } from "@/components/nav/NavBar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import useToast from "@/hooks/use-toast";
import {
  useGetJobSeekerNotificationsQuery,
  useGetUnReadNotificationsCountQuery,
} from "@/services/slices/notificationSlice";
import PortalCopyRight from "@/components/common/PortalCopyRight";
import { createReconnectingWebSocket } from "@/lib/reconnectingWebSocket";
import { CompleteProfileModal } from "@/components/common/CompleteProfileModal";

export const MainLayout = () => {
  const socketRef = useRef<ReturnType<typeof createReconnectingWebSocket> | null>(null);
  const token = useSelector((state: any) => state.auth.token);
  const { showNotification } = useToast();
  const { refetch } = useGetUnReadNotificationsCountQuery();
  const { refetch: refetchIsRead } = useGetJobSeekerNotificationsQuery({
    limit: 10,
    offset: 0,
  });
  const { pathname } = useLocation();
  const [isNewUser, setIsNewUser] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Stable refetch handler (prevents effect from rerunning unnecessarily)
  const handleRefetch = useCallback(() => {
    setTimeout(() => {
      refetch();
      refetchIsRead();
    }, 500);
  }, [refetch, refetchIsRead]);

  useEffect(() => {
    if (!token) return;

    // Request notification permission once
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Check if user is new
    if (localStorage.getItem("isnew") === "isnew") {
      setIsNewUser(true);
    }

    // Create WebSocket connection
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
          // Toast notification
          showNotification({
            message: data.message,
            type: "success",
          });

          // Refetch notifications with debounce
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
      socket.close();
    };
  }, [token, handleRefetch, showNotification]);

  return (
    <>
      <NavBar />
      <div className="mt-[100px]">
        <Outlet />
      </div>
      <PortalCopyRight />

      <CompleteProfileModal isOpen={isNewUser} onClose={() => setIsNewUser(false)} />
    </>
  );
};

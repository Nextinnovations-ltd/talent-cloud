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
import { CompleteProfileModal } from "@/components/common/CompleteProfileModal";

export const MainLayout = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false); // ✅ prevents duplicate connections

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

  // Debounced refetch handler
  const handleRefetch = useCallback(() => {
    if (refetchTimeoutRef.current) {
      clearTimeout(refetchTimeoutRef.current);
    }
    refetchTimeoutRef.current = setTimeout(() => {
      refetch();
      refetchIsRead();
    }, 500);
  }, [refetch, refetchIsRead]);

  const connectSocket = useCallback(() => {
    if (!token || isConnectingRef.current) return;

    isConnectingRef.current = true;

    // Close any existing socket
    if (socketRef.current) {
      socketRef.current.onopen = null;
      socketRef.current.onmessage = null;
      socketRef.current.onclose = null;
      socketRef.current.onerror = null;
      socketRef.current.close();
    }

    const ws = new WebSocket(`ws://staging.talent-cloud.asia/ws/notifications/?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      isConnectingRef.current = false;

      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);

      // Start heartbeat
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);
        if (data.type === "notification") {
          showNotification({
            message: data.message,
            type: "success",
          });

          handleRefetch();

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
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected. Retrying...");
      isConnectingRef.current = false;
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);

      reconnectTimerRef.current = setTimeout(connectSocket, 3000);
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error", err);
      ws.close();
    };
  }, [token, handleRefetch, showNotification]);

  useEffect(() => {
    if (!token) return;

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    if (localStorage.getItem("isnew") === "isnew") {
      setIsNewUser(true);
    }

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.onopen = null;
        socketRef.current.onmessage = null;
        socketRef.current.onclose = null;
        socketRef.current.onerror = null;
        socketRef.current.close();
      }
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
    };
  }, [token, connectSocket]);

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

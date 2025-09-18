/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavBar } from "@/components/nav/NavBar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import useToast from "@/hooks/use-toast";
import { useGetJobSeekerNotificationsQuery, useGetUnReadNotificationsCountQuery } from "@/services/slices/notificationSlice";
import PortalCopyRight from "@/components/common/PortalCopyRight";
import { createReconnectingWebSocket } from "@/lib/reconnectingWebSocket";
import { CompleteProfileModal } from "@/components/common/CompleteProfileModal";

export const MainLayout = () => {
  const socketRef = useRef<ReturnType<typeof createReconnectingWebSocket> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_messages, setMessages] = useState<string[]>([]);
  const token = useSelector((state: any) => state.auth.token); // Get token from Redux state
  const { showNotification } = useToast();
  const { refetch } = useGetUnReadNotificationsCountQuery();
  const { refetch: RefetchIsRead } = useGetJobSeekerNotificationsQuery({ limit: 10, offset: 0 });
  const { pathname } = useLocation();
  const [isNewUser,setIsNewUser] = useState(false);

  // Stable refetch handler
  const handleRefetch = useCallback(() => {
    refetch();
    RefetchIsRead();
  }, [refetch, RefetchIsRead]);

  useEffect(() => {
    // Scroll to top whenever route changes
    window.scrollTo({ top: 0, behavior: "instant" });
    // use "smooth" instead of "instant" if you want smooth scrolling
  }, [pathname]);

  useEffect(() => {
    if (!token) return;

    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const isNewUserFlag = localStorage.getItem('isnew');
    
    if (isNewUserFlag === 'isnew') {
      setIsNewUser(true);
    }

    // Clean up existing socket connection before creating a new one
    if (socketRef.current) {
      socketRef.current.clearListeners();
      socketRef.current.close();
      socketRef.current = null;
    }

    socketRef.current = createReconnectingWebSocket({
      makeUrl: () => `ws://localhost:8000/ws/notifications/?token=${token}`,
      initialBackoffMs: 1000,
      maxBackoffMs: 30000,
      heartbeatMs: 30000,
    });

    //staging.talent-cloud.asia

    socketRef.current.onOpen(() => {
      console.log('✅ WebSocket connected');
    });

    socketRef.current.onMessage((event) => {
      try {
        const data = JSON.parse(event.data as string);

        if (data.type === 'notification') {
          setMessages((prev) => [...prev, data.message]);

          // Show notification toast
          showNotification({
            message: data.message,
            type: "success",
          });

          // Refetch immediately when notification is received
          handleRefetch();

          // Show browser notification if permission is granted
          if (Notification.permission === 'granted') {
            new Notification('Talent Cloud', {
              body: data.message,
              icon: './talent_logo.svg'
            });
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    socketRef.current.onClose(() => {
      console.log('❌ WebSocket disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.clearListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [token, handleRefetch, showNotification]); // Include all dependencies

  return (
    <>
      {/* <ProtectRoute> */}
      <NavBar />
      <div className="mt-[100px]">
        <Outlet />
      </div>
      <PortalCopyRight />
      

      <CompleteProfileModal 
        isOpen={isNewUser} 
        onClose={() => setIsNewUser(false)} 
      />



      {/* <Footer /> */}
      {/* </ProtectRoute> */}
    </>
  );
};

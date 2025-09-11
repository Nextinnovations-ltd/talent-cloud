/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavBar } from "@/components/nav/NavBar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
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

    socketRef.current = createReconnectingWebSocket({
      makeUrl: () => `ws://staging.talent-cloud.asia/ws/notifications/?token=${token}`,
      initialBackoffMs: 1000,
      maxBackoffMs: 30000,
      heartbeatMs: 30000,
    });

    socketRef.current.onOpen(() => {
      console.log('✅ WebSocket connected');
    });

    socketRef.current.onMessage((event) => {
      const data = JSON.parse(event.data as string);

      if (data.type === 'notification') {
        setMessages((prev) => [...prev, data.message]);

        // Show notification toast
        showNotification({
          message: data.message,
          type: "success",
        });

        // Add a small delay before refetching to ensure backend update is complete
        setTimeout(() => {
          refetch();
          RefetchIsRead()
        }, 500);

        // Show browser notification if permission is granted
        if (Notification.permission === 'granted') {
          new Notification('Talent Cloud', {
            body: data.message,
            icon: './talent_logo.svg'
          });
        }
      }
    });

    socketRef.current.onClose(() => {
      console.log('❌ WebSocket disconnected');
    });

    return () => {
      socketRef.current?.close();
    };
  }, [RefetchIsRead, refetch, showNotification, token]);

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

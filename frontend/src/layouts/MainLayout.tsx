/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavBar } from "@/components/nav/NavBar";
import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useToast from "@/hooks/use-toast";
import { useGetJobSeekerNotificationsQuery, useGetUnReadNotificationsCountQuery } from "@/services/slices/notificationSlice";


export const MainLayout = () => {
  const socketRef = useRef<WebSocket | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_messages, setMessages] = useState<string[]>([]);
  const token = useSelector((state: any) => state.auth.token); // Get token from Redux state
  const { showNotification } = useToast();
  const { refetch } = useGetUnReadNotificationsCountQuery();
  const { refetch:RefetchIsRead } = useGetJobSeekerNotificationsQuery({ limit:10, offset:0 });

  useEffect(() => {
    if (!token) return;

    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const wsUrl = `ws://staging.talent-cloud.asia/api/ws/notifications/?token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      
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
    };

    socketRef.current.onclose = () => {
      console.log('❌ WebSocket disconnected');
    };

    const interval = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => {
      clearInterval(interval);
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
        {/* <Footer /> */}
      {/* </ProtectRoute> */}
    </>
  );
};

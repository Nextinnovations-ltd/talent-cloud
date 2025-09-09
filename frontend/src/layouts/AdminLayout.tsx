/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminSideBar from "@/components/nav/admin/AdminSideBar";
import NotificationDropDown from "@/components/notifications/notificationDropDown";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useToast from "@/hooks/use-toast";
import { useGetJobSeekerNotificationsQuery, useGetUnReadNotificationsCountQuery } from "@/services/slices/notificationSlice";
import { createReconnectingWebSocket } from "@/lib/reconnectingWebSocket";

const AdminLayout = () => {

  const token = useSelector((state: any) => state.auth.token); 
  const socketRef = useRef<ReturnType<typeof createReconnectingWebSocket> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_messages, setMessages] = useState<string[]>([]);
  const { showNotification } = useToast();
  const { refetch } = useGetUnReadNotificationsCountQuery();
  const { refetch:RefetchIsRead } = useGetJobSeekerNotificationsQuery({ limit:10, offset:0 });

  const { pathname } = useLocation();

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

        console.log(data?.message);
        
        // Show notification toast
        showNotification({
          message: data.message,
          type: "success",
        });
        
        // Add a small delay before refetching to ensure backenbbbd update is complete
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
    <div>
      <AdminSideBar />
      <div className="ml-[263px] min-h-screen">
        {/* Sticky Header */}
        <div className="bg-white flex items-center justify-end pr-5 border-b border-b-[#F2F2F2] z-50  w-full h-[70px] sticky top-0 ">
         <NotificationDropDown/>
        </div>

        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

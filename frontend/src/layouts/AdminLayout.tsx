/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminSideBar from "@/components/nav/admin/AdminSideBar";
import NotificationDropDown from "@/components/notifications/notificationDropDown";
import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useToast from "@/hooks/use-toast";
import { useGetJobSeekerNotificationsQuery, useGetUnReadNotificationsCountQuery } from "@/services/slices/notificationSlice";

const AdminLayout = () => {

  const token = useSelector((state: any) => state.auth.token); 
  const socketRef = useRef<WebSocket | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_messages, setMessages] = useState<string[]>([]);
  const { showNotification } = useToast();
  const { refetch } = useGetUnReadNotificationsCountQuery();
  const { refetch:RefetchIsRead } = useGetJobSeekerNotificationsQuery({ limit:10, offset:0 });

  useEffect(() => {
    if (!token) return;

    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const wsUrl = `ws://localhost:8000/ws/notifications/?token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'notification') {
        setMessages((prev) => [...prev, data.message]);

        console.log(data?.message);
        
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
    <div>
      <AdminSideBar />
      <div className="ml-[263px] min-h-screen">
        {/* Sticky Header */}
        <div className="bg-white flex items-center justify-end pr-5 border-b border-b-[#F2F2F2] w-full h-[70px] sticky top-0 ">
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

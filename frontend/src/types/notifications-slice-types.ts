export type Notification = {
    id: number;
    title: string;
    message: string;
    destination_url: string;
    notification_type: 'admin_maintenance' | string; // Adjust enum as needed
    channel: 'websocket' | string; // Add more channels if there are others
    is_read: boolean;
    created_at: string; // ISO date string
  };
  
  export type NotificationsResponse = {
    status: boolean;
    message: string;
    data: {
      notifications: Notification[];
      unread_count: number;
      total_count:number
    };
  };
  

  export type UnreadNotificationsCount = {
    status:boolean;
    message:string;
    data:{
        unread_count:number
    }
  }
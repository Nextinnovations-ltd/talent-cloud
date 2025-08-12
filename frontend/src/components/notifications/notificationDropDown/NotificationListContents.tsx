import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  useGetJobSeekerNotificationsQuery,
  useGetMarkAsReadMutation,
} from "@/services/slices/notificationSlice";
import clsx from "clsx";
import React from "react";

export interface NotificationData {
  id: number;
  title?: string;
  message?: string;
  description?: string;
  is_read?: boolean;
  created_at?: string;
}

interface NotificationListItemsProps {
  data?: NotificationData;
  limit: number;
  offset: number;
  onMarkAsRead?: (id: number) => void;
}

const NotificationListItems: React.FC<NotificationListItemsProps> = ({
  data = {},
  limit,
  offset,
  onMarkAsRead,
}) => {
  const [open, setOpen] = React.useState(false);
  const [markAsRead] = useGetMarkAsReadMutation();
  const { refetch } = useGetJobSeekerNotificationsQuery({ limit, offset });

  const handleReadNotification = async (id: number | undefined) => {
    if (!id || data?.is_read) return;

    try {
      // Optimistically update the UI first
      if (onMarkAsRead) onMarkAsRead(id);
      
      // Then make the API call
      await markAsRead(id).unwrap();
      
      // Finally, refetch notifications to ensure consistency
      await refetch();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const isUnread = !data?.is_read;

  // Format the time since notification was created
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "Just now";
    
    const now = new Date();
    const created = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.stopPropagation();
        handleReadNotification(data?.id);
        setOpen((o) => !o);
      }}
      className={clsx(
        "rounded-md mb-2 flex items-center gap-3 transition-colors w-[97%] mx-auto",
        "duration-150 px-2 relative cursor-pointer",
        isUnread
          ? "bg-blue-50 hover:bg-blue-100 font-semibold text-black"
          : "bg-white text-gray-500"
      )}
      onSelect={(e) => e.preventDefault()}
      aria-label={data?.title || data?.message || "Notification"}
    >
      {isUnread && (
        <span
          className="absolute top-[-1px] left-[-1px] block h-3 w-3 rounded-full bg-blue-500 border-2 border-white"
          aria-label="Unread notification indicator"
        />
      )}

      <div className="flex flex-col px-2 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 min-w-0">
            <p
              className={clsx(
                isUnread ? "font-semibold" : "font-normal text-black",
                "truncate"
              )}
              title={data?.title || "No title"}
            >
              {data?.title || (
                <span className="text-gray-400 italic">(No title)</span>
              )}
            </p>
          </div>

          {data?.message && (
            <button
              type="button"
              className="ml-2 focus:outline-none"
              aria-label={open ? "Hide message" : "Show message"}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => !o);
              }}
              tabIndex={0}
            >
              <svg
                className={clsx(
                  "w-4 h-4 transition-transform duration-200",
                  open && "rotate-90"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {open && data?.message && (
          <div className="mt-1">
            <p className="text-[12px] text-gray-600 whitespace-pre-line">
              {data.message}
            </p>
          </div>
        )}

        <p className="text-gray-400 font-semibold text-xs">
          {formatTimeAgo(data?.created_at)}
        </p>
      </div>
    </DropdownMenuItem>
  );
};

export default NotificationListItems;
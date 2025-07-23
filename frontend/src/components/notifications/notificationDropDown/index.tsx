
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationHeader } from "./NotificationHeader";
import NotificationListItems from "./NotificationListContents";
import { useGetJobSeekerNotificationsQuery } from "@/services/slices/notificationSlice";
import NotiBadge from "./NotiBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from 'react';
import { Notification } from '@/types/notifications-slice-types';
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";

const NotificationDropDown = () => {
    const LIMIT = 10;
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const { data, isFetching } = useGetJobSeekerNotificationsQuery({ limit: LIMIT, offset });

    useEffect(() => {
        if (data?.data?.notifications) {
            if (offset === 0) {
                setNotifications(data.data.notifications);
            } else {
                setNotifications((prev) => [...prev, ...data.data.notifications]);
            }
            setHasMore(data.data.notifications.length === LIMIT);
        }
    }, [data]);

    const handleLoadMore = () => {
        if (!isFetching && hasMore) {
            setOffset((prev) => prev + LIMIT);
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="ring-0 outline-none">
                <NotiBadge   />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[350px] p-[16px] mt-[5px]">
                <NotificationHeader onClose={() => setOpen(false)} />
                <div className="border-t border-slate-200 my-3"></div>
                <ScrollArea className="h-[300px]">
                    {notifications.map((data, index) => (
                        <NotificationListItems data={data} key={index} Readed={data?.is_read} unRead={!data?.is_read} />
                    ))}
                    {hasMore && (
                        <div className="flex justify-center py-2 px-2">
                            <Button 
                                variant="outline"
                                size="sm"
                                onClick={handleLoadMore}
                                disabled={isFetching}
                                className="w-full bg-white border-none hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium text-sm rounded-lg shadow-none"
                            >
                                {isFetching ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                        <span>Loading more...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <span>Show More</span>
                                        <ChevronDown size={18}/>
                                    </div>
                                )}
                            </Button>
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default NotificationDropDown
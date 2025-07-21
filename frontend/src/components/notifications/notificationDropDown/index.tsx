
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
import React, { useState } from 'react';

const NotificationDropDown = () => {

    const { data } = useGetJobSeekerNotificationsQuery();

    const notificationsData = data?.data;

    const [open, setOpen] = useState(false);


    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="ring-0 outline-none">
                <NotiBadge />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[350px] p-[16px]  mt-[5px] ">
                <NotificationHeader onClose={() => setOpen(false)} />
                <div className="border-t border-slate-200 my-3"></div>
                <ScrollArea className="h-[300px]">
                {
                    notificationsData?.notifications?.map((data, index) => {

                        return (
                            <NotificationListItems key={index} Readed={data?.is_read} unRead={!data?.is_read} />
                        )
                    })
                }
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export default NotificationDropDown
import { NotificationsResponse, UnreadNotificationsCount } from "@/types/notifications-slice-types";
import apiSlice from "../api/apiSlice";


export const extendedNotificationsSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=> ({
        getJobSeekerNotifications:builder.query<NotificationsResponse,void>({
            query:()=>'/notifications/?limit=20&offset=0'
        }),
        getUnReadNotificationsCount:builder.query<UnreadNotificationsCount,void>({
            query:()=>'/notifications/unread-count'
        })
    })
})

export const {
 useGetJobSeekerNotificationsQuery,
 useGetUnReadNotificationsCountQuery
} = extendedNotificationsSlice;
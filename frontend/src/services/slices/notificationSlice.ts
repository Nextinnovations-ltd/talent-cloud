import { NotificationsResponse, UnreadNotificationsCount } from "@/types/notifications-slice-types";
import apiSlice from "../api/apiSlice";


export const extendedNotificationsSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=> ({
        getJobSeekerNotifications: builder.query<NotificationsResponse, { limit: number; offset: number }>({
            query: ({ limit, offset }) => `/notifications/?limit=${limit}&offset=${offset}`
        }),
        getUnReadNotificationsCount:builder.query<UnreadNotificationsCount,void>({
            query:()=>'/notifications/'
        }),
        
    })
})

export const {
 useGetJobSeekerNotificationsQuery,
 useGetUnReadNotificationsCountQuery
} = extendedNotificationsSlice;
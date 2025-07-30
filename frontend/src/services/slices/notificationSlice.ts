import { NotificationsResponse, UnreadNotificationsCount } from "@/types/notifications-slice-types";
import apiSlice from "../api/apiSlice";


export const extendedNotificationsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getJobSeekerNotifications: builder.query<NotificationsResponse, { limit: number; offset: number }>({
            query: ({ limit, offset }) => `/notifications/?limit=${limit}&offset=${offset}`,
            providesTags: ['NotificationList']
        }),
        getUnReadNotificationsCount: builder.query<UnreadNotificationsCount, void>({
            query: () => '/notifications/',
            providesTags: ['NotificationList']

        }),
        getMarkAsRead: builder.mutation<unknown, number>({
            query: (notiId) => ({
                url: `/notifications/mark-as-read/${notiId}`,
                method: "POST"
            }),
            invalidatesTags: ['NotificationList']

        }),
        markedAsAllRead:builder.mutation<unknown,void>({
            query: () => ({
                url: `/notifications/mark-all-read/`,
                method: "POST"
            }),
            invalidatesTags: ['NotificationList']
        })
    })
})

export const {
    useGetJobSeekerNotificationsQuery,
    useGetUnReadNotificationsCountQuery,
    useGetMarkAsReadMutation,
    useMarkedAsAllReadMutation
} = extendedNotificationsSlice;
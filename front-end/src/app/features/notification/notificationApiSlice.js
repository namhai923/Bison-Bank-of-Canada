import { apiSlice } from 'app/api/apiSlice';

export const notificationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotificationList: builder.query({
            query: () => ({
                url: '/notification/getNotificationList'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'Notification', id: 'notificationList' }]
        }),
        deleteNotification: builder.mutation({
            query: (notificationId) => ({
                url: '/notification/deleteNotification',
                method: 'POST',
                params: {
                    id: notificationId
                }
            }),
            invalidatesTags: [{ type: 'Notification', id: 'notificationList' }]
        }),
        markReadNotification: builder.mutation({
            query: (notificationId) => ({
                url: '/notification/markReadNotification',
                method: 'POST',
                params: {
                    id: notificationId
                }
            }),
            invalidatesTags: [{ type: 'Notification', id: 'notificationList' }]
        })
    })
});

export const { useGetNotificationListQuery, useDeleteNotificationMutation, useMarkReadNotificationMutation } = notificationApiSlice;

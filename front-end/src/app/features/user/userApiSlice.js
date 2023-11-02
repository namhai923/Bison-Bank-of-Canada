import jwtDecode from 'jwt-decode';

import { apiSlice } from 'app/api/apiSlice';
import getSocket from 'app/getSocket';
import store from 'app/store';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserInfo: builder.query({
            query: () => ({
                url: '/user/getInfo'
            }),
            providesTags: [{ type: 'User', id: 'userInfo' }]
        }),
        getFavorSummary: builder.query({
            query: () => ({
                url: '/user/getFavorSummary'
            }),
            providesTags: [{ type: 'User', id: 'favorSummary' }]
        }),
        getDebtSummary: builder.query({
            query: () => ({
                url: '/user/getDebtSummary'
            }),
            providesTags: [{ type: 'User', id: 'debtSummary' }]
        }),
        getFavorHistory: builder.query({
            query: () => ({
                url: '/user/getFavorHistory'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'User', id: 'favorHistory' }]
        }),
        getDebtHistory: builder.query({
            query: () => ({
                url: '/user/getDebtHistory'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'User', id: 'debtHistory' }]
        }),
        getRepayHistory: builder.query({
            query: () => ({
                url: '/user/getRepayHistory'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'User', id: 'repayHistory' }]
        }),
        getPendingFavor: builder.query({
            query: () => ({
                url: '/user/getPendingFavor'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'User', id: 'pendingFavor' }]
        }),
        getPendingRepay: builder.query({
            query: () => ({
                url: '/user/getPendingRepay'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'User', id: 'pendingRepay' }]
        }),
        getContacts: builder.query({
            query: () => ({
                url: '/user/getContacts'
            }),
            providesTags: [{ type: 'User', id: 'contacts' }]
        }),
        getNotificationList: builder.query({
            query: () => ({
                url: '/user/getNotificationList'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'User', id: 'notificationList' }]
        }),
        getConversationsInfo: builder.query({
            query: () => ({
                url: '/user/getConversationsInfo'
            }),
            transformResponse: (response) => {
                let { currentConversation } = store.getState().value;
                if (currentConversation) {
                    let findConversation = response.find((conversation) => conversation.userName === currentConversation);
                    if (findConversation) {
                        findConversation.unRead = 0;
                    }
                }
                return response.sort((a, b) => new Date(b.latestMessage.updatedAt) - new Date(a.latestMessage.updatedAt));
            },
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }) {
                try {
                    await cacheDataLoaded;

                    const socket = getSocket(getState().auth.token);

                    socket.on('message:receive', (messageInfo) => {
                        updateCachedData((draft) => {
                            let { currentConversation } = getState().value;
                            let findConversation = draft.find((conversation) => conversation.userName === messageInfo.sender);

                            if (findConversation) {
                                findConversation.unRead += 1;
                                findConversation.latestMessage = messageInfo.latestMessage;
                                if (currentConversation) {
                                    if (currentConversation === findConversation.userName) {
                                        findConversation.unRead = 0;
                                        socket.emit('message:read', messageInfo.sender);
                                    }
                                }
                            } else {
                                draft.push({ userName: messageInfo.sender, latestMessage: messageInfo.latestMessage, unRead: 1 });
                            }
                            draft.sort((a, b) => new Date(b.latestMessage.updatedAt) - new Date(a.latestMessage.updatedAt));
                        });
                    });

                    await cacheEntryRemoved;
                    socket.off('message:receive');
                } catch (err) {
                    console.log(err);
                }
            },
            providesTags: [{ type: 'User', id: 'conversationsInfo' }]
        }),
        getConversation: builder.query({
            query: (userName) => ({
                url: '/user/getConversation',
                params: {
                    userName: userName
                }
            }),

            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }) {
                try {
                    await cacheDataLoaded;

                    const socket = getSocket(getState().auth.token);

                    socket.on('message:receive', (messageInfo) => {
                        updateCachedData((draft) => {
                            let { currentConversation } = getState().value;
                            if (currentConversation) {
                                if (currentConversation === messageInfo.sender) {
                                    draft.push(messageInfo.latestMessage);
                                }
                            }
                        });
                    });

                    await cacheEntryRemoved;
                    socket.off('message:receive');
                } catch (err) {
                    console.log(err);
                }
            },
            providesTags: (result, error, arg) => [{ type: 'User', id: `${arg} conversation` }]
        }),
        searchUser: builder.mutation({
            query: (searchQuery) => {
                return {
                    url: '/user/searchUser',
                    method: 'GET',
                    params: {
                        searchQuery
                    }
                };
            },
            transformResponse: (response) => {
                let { token } = store.getState().auth;
                let { userName } = jwtDecode(token);
                return response.filter((user) => user.userName !== userName).sort((a, b) => a.userName.localeCompare(b.userName));
            }
        }),
        updateUserInfo: builder.mutation({
            query: (updateInfo) => {
                return {
                    url: '/user/updateInfo',
                    method: 'POST',
                    body: updateInfo
                };
            },
            invalidatesTags: [{ type: 'User', id: 'userInfo' }]
        }),
        makeFavorRequest: builder.mutation({
            query: (makeFavorRequestInfo) => ({
                url: '/user/makeFavorRequest',
                method: 'POST',
                body: makeFavorRequestInfo
            }),
            invalidatesTags: [{ type: 'User', id: 'favorHistory' }]
        }),
        makeRepayRequest: builder.mutation({
            query: (makeRepayRequestInfo) => ({
                url: '/user/makeRepayRequest',
                method: 'POST',
                body: makeRepayRequestInfo
            }),
            invalidatesTags: [{ type: 'User', id: 'repayHistory' }]
        }),
        responseFavor: builder.mutation({
            query: (responseFavorInfo) => ({
                url: '/user/responseFavor',
                method: 'POST',
                body: responseFavorInfo
            }),
            invalidatesTags: [
                { type: 'User', id: 'debtHistory' },
                { type: 'User', id: 'debtSummary' },
                { type: 'User', id: 'pendingFavor' }
            ]
        }),
        responseRepay: builder.mutation({
            query: (responseRepayInfo) => ({
                url: '/user/responseRepay',
                method: 'POST',
                body: responseRepayInfo
            }),
            invalidatesTags: [
                { type: 'User', id: 'repayHistory' },
                { type: 'User', id: 'pendingRepay' }
            ]
        }),
        addContact: builder.mutation({
            query: (contactInfo) => ({
                url: '/user/addContact',
                method: 'POST',
                body: contactInfo
            }),
            invalidatesTags: [{ type: 'User', id: 'contacts' }]
        }),
        removeContact: builder.mutation({
            query: (contactsInfo) => ({
                url: '/user/removeContacts',
                method: 'POST',
                body: contactsInfo
            }),
            invalidatesTags: [{ type: 'User', id: 'contacts' }]
        }),
        sendMessage: builder.mutation({
            query: (messageInfo) => ({
                url: '/user/sendMessage',
                method: 'POST',
                body: messageInfo
            }),
            async onQueryStarted(arg, { getState, queryFulfilled }) {
                try {
                    let result = await queryFulfilled;
                    const socket = getSocket(getState().auth.token);
                    socket.emit('message:send', arg.userName, result.data);
                } catch (err) {
                    console.log(err);
                }
            },
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: `${arg.userName} conversation` },
                { type: 'User', id: 'conversationsInfo' }
            ]
        }),
        deleteConversation: builder.mutation({
            query: (deleteConversationUserName) => ({
                url: '/user/deleteConversation',
                method: 'POST',
                params: {
                    userName: deleteConversationUserName
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: 'conversationsInfo' },
                { type: 'User', id: `${arg.userName} conversation` }
            ]
        }),
        deleteNotification: builder.mutation({
            query: (notificationId) => ({
                url: '/user/deleteNotification',
                method: 'POST',
                params: {
                    id: notificationId
                }
            }),
            invalidatesTags: [{ type: 'User', id: 'notificationList' }]
        }),
        markReadNotification: builder.mutation({
            query: (notificationId) => ({
                url: '/user/markReadNotification',
                method: 'POST',
                params: {
                    id: notificationId
                }
            }),
            invalidatesTags: [{ type: 'User', id: 'notificationList' }]
        })
    })
});

export const {
    useGetUserInfoQuery,
    useGetFavorSummaryQuery,
    useGetDebtSummaryQuery,
    useGetFavorHistoryQuery,
    useGetDebtHistoryQuery,
    useGetRepayHistoryQuery,
    useGetPendingFavorQuery,
    useGetPendingRepayQuery,
    useGetContactsQuery,
    useGetNotificationListQuery,
    useGetConversationsInfoQuery,
    useGetConversationQuery,
    useSearchUserMutation,
    useUpdateUserInfoMutation,
    useMakeFavorRequestMutation,
    useMakeRepayRequestMutation,
    useResponseFavorMutation,
    useResponseRepayMutation,
    useAddContactMutation,
    useRemoveContactMutation,
    useSendMessageMutation,
    useDeleteConversationMutation,
    useDeleteNotificationMutation,
    useMarkReadNotificationMutation
} = userApiSlice;

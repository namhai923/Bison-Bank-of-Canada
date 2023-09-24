import { apiSlice } from 'app/api/apiSlice';
import getSocket from 'app/getSocket';
import store from 'app/store';

const conversationsSort = function (a, b) {
    return new Date(b.latestMessage.updatedAt) - new Date(a.latestMessage.updatedAt);
};

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserInfo: builder.query({
            query: () => ({
                url: '/user/getInfo'
            }),
            providesTags: [{ type: 'User', id: 'userInfo' }]
        }),
        getBalance: builder.query({
            query: () => ({
                url: '/user/getBalance'
            }),
            providesTags: [{ type: 'User', id: 'accountBalance' }]
        }),
        getExpense: builder.query({
            query: () => ({
                url: '/user/getExpense'
            }),
            providesTags: [{ type: 'User', id: 'expenseHistory' }]
        }),
        getTransfer: builder.query({
            query: () => ({
                url: '/user/getTransfer'
            }),
            providesTags: [{ type: 'User', id: 'transferHistory' }]
        }),
        getContacts: builder.query({
            query: () => ({
                url: '/user/getContacts'
            }),
            providesTags: [{ type: 'User', id: 'contacts' }]
        }),
        getConversationsInfo: builder.query({
            query: () => ({
                url: '/user/getConversationsInfo'
            }),
            transformResponse: (response) => {
                let { currentConversation } = store.getState().value;
                if (currentConversation) {
                    let findConversation = response.find((conversation) => conversation.userName === currentConversation.userName);
                    if (findConversation) {
                        findConversation.unRead = 0;
                    }
                }
                return response.sort(conversationsSort);
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
                                    if (currentConversation.userName === findConversation.userName) {
                                        findConversation.unRead = 0;
                                        socket.emit('message:read', messageInfo.sender);
                                    }
                                }
                            } else {
                                draft.push({ userName: messageInfo.sender, latestMessage: messageInfo.latestMessage, unRead: 1 });
                            }
                            draft.sort(conversationsSort);
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
                                if (currentConversation.userName === messageInfo.sender) {
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
        addExpense: builder.mutation({
            query: (expenseInfo) => ({
                url: '/user/expense',
                method: 'POST',
                body: expenseInfo
            }),
            invalidatesTags: [
                { type: 'User', id: 'expenseHistory' },
                { type: 'User', id: 'accountBalance' }
            ]
        }),
        addTransfer: builder.mutation({
            query: (transferInfo) => ({
                url: '/user/transfer',
                method: 'POST',
                body: transferInfo
            }),
            invalidatesTags: [
                { type: 'User', id: 'transferHistory' },
                { type: 'User', id: 'accountBalance' }
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
        })
    })
});

export const {
    useGetUserInfoQuery,
    useGetBalanceQuery,
    useGetExpenseQuery,
    useGetTransferQuery,
    useGetContactsQuery,
    useGetConversationsInfoQuery,
    useGetConversationQuery,
    useUpdateUserInfoMutation,
    useAddExpenseMutation,
    useAddTransferMutation,
    useAddContactMutation,
    useRemoveContactMutation,
    useSendMessageMutation,
    useDeleteConversationMutation
} = userApiSlice;

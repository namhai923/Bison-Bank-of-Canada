import { apiSlice } from 'app/api/apiSlice';
import getSocket from 'app/getSocket';
import store from 'app/store';

export const messengerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getConversationsInfo: builder.query({
            query: () => ({
                url: '/messenger/getConversationsInfo'
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
            providesTags: [{ type: 'Messenger', id: 'conversationsInfo' }]
        }),
        getConversation: builder.query({
            query: (userName) => ({
                url: '/messenger/getConversation',
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
            providesTags: (result, error, arg) => [{ type: 'Messenger', id: `${arg} conversation` }]
        }),
        sendMessage: builder.mutation({
            query: (messageInfo) => ({
                url: '/messenger/sendMessage',
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
                { type: 'Messenger', id: `${arg.userName} conversation` },
                { type: 'Messenger', id: 'conversationsInfo' }
            ]
        }),
        deleteConversation: builder.mutation({
            query: (deleteConversationUserName) => ({
                url: '/messenger/deleteConversation',
                method: 'POST',
                params: {
                    userName: deleteConversationUserName
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Messenger', id: 'conversationsInfo' },
                { type: 'Messenger', id: `${arg.userName} conversation` }
            ]
        })
    })
});

export const { useGetConversationsInfoQuery, useGetConversationQuery, useSendMessageMutation, useDeleteConversationMutation } =
    messengerApiSlice;

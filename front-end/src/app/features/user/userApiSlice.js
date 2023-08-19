// import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from 'app/api/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserInfo: builder.query({
            query: (userName) => ({
                url: '/user/getInfo',
                params: {
                    userName: userName
                }
            }),
            providesTags: [{ type: 'User', id: 'userInfo' }]
        }),
        getBalance: builder.query({
            query: (userName) => ({
                url: '/user/getBalance',
                params: {
                    userName: userName
                }
            }),
            providesTags: [{ type: 'User', id: 'accountBalance' }]
        }),
        getExpense: builder.query({
            query: (userName) => ({
                url: '/user/getExpense',
                params: {
                    userName: userName
                }
            }),
            providesTags: [{ type: 'User', id: 'expenseHistory' }]
        }),
        getTransfer: builder.query({
            query: (userName) => ({
                url: '/user/getTransfer',
                params: {
                    userName: userName
                }
            }),
            providesTags: [{ type: 'User', id: 'transferHistory' }]
        }),
        updateUserInfo: builder.mutation({
            query: ({ userName, updateInfo }) => {
                return {
                    url: '/user/updateInfo',
                    method: 'POST',
                    params: {
                        userName: userName
                    },
                    body: updateInfo
                };
            },
            invalidatesTags: [{ type: 'User', id: 'userInfo' }]
        }),
        addExpense: builder.mutation({
            query: ({ userName, expenseInfo }) => ({
                url: '/user/expense',
                method: 'POST',
                params: {
                    userName: userName
                },
                body: expenseInfo
            }),
            invalidatesTags: [
                { type: 'User', id: 'expenseHistory' },
                { type: 'User', id: 'accountBalance' }
            ]
        }),
        addTransfer: builder.mutation({
            query: ({ userName, transferInfo }) => ({
                url: '/user/transfer',
                method: 'POST',
                params: {
                    userName: userName
                },
                body: transferInfo
            }),
            invalidatesTags: [
                { type: 'User', id: 'transferHistory' },
                { type: 'User', id: 'accountBalance' }
            ]
        })
    })
});

export const {
    useGetUserInfoQuery,
    useGetBalanceQuery,
    useGetExpenseQuery,
    useGetTransferQuery,
    useUpdateUserInfoMutation,
    useAddExpenseMutation,
    useAddTransferMutation
} = userApiSlice;

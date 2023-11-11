import { apiSlice } from 'app/api/apiSlice';

export const repayApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRepayHistory: builder.query({
            query: () => ({
                url: '/repay/getRepayHistory'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'Repay', id: 'repayHistory' }]
        }),
        getPendingRepay: builder.query({
            query: () => ({
                url: '/repay/getPendingRepay'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'Repay', id: 'pendingRepay' }]
        }),
        makeRepayRequest: builder.mutation({
            query: (makeRepayRequestInfo) => ({
                url: '/repay/makeRepayRequest',
                method: 'POST',
                body: makeRepayRequestInfo
            }),
            invalidatesTags: [{ type: 'Repay', id: 'repayHistory' }]
        }),
        responseRepay: builder.mutation({
            query: (responseRepayInfo) => ({
                url: '/repay/responseRepay',
                method: 'POST',
                body: responseRepayInfo
            }),
            invalidatesTags: [
                { type: 'Repay', id: 'repayHistory' },
                { type: 'Repay', id: 'pendingRepay' }
            ]
        })
    })
});

export const { useGetRepayHistoryQuery, useGetPendingRepayQuery, useMakeRepayRequestMutation, useResponseRepayMutation } = repayApiSlice;

import { apiSlice } from 'app/api/apiSlice';

export const debtApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDebtSummary: builder.query({
            query: () => ({
                url: '/debt/getDebtSummary'
            }),
            providesTags: [{ type: 'Debt', id: 'debtSummary' }]
        }),
        getDebtHistory: builder.query({
            query: () => ({
                url: '/debt/getDebtHistory'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'Debt', id: 'debtHistory' }]
        })
    })
});

export const { useGetDebtSummaryQuery, useGetDebtHistoryQuery } = debtApiSlice;

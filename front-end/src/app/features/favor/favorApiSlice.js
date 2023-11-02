import { apiSlice } from 'app/api/apiSlice';

export const favorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFavorSummary: builder.query({
            query: () => ({
                url: '/favor/getFavorSummary'
            }),
            providesTags: [{ type: 'Favor', id: 'favorSummary' }]
        }),
        getFavorHistory: builder.query({
            query: () => ({
                url: '/favor/getFavorHistory'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'Favor', id: 'favorHistory' }]
        }),

        getPendingFavor: builder.query({
            query: () => ({
                url: '/favor/getPendingFavor'
            }),
            transformResponse: (response) => response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            providesTags: [{ type: 'Favor', id: 'pendingFavor' }]
        }),
        makeFavorRequest: builder.mutation({
            query: (makeFavorRequestInfo) => ({
                url: '/favor/makeFavorRequest',
                method: 'POST',
                body: makeFavorRequestInfo
            }),
            invalidatesTags: [{ type: 'Favor', id: 'favorHistory' }]
        }),
        responseFavor: builder.mutation({
            query: (responseFavorInfo) => ({
                url: '/favor/responseFavor',
                method: 'POST',
                body: responseFavorInfo
            }),
            invalidatesTags: [
                { type: 'Debt', id: 'debtHistory' },
                { type: 'Debt', id: 'debtSummary' },
                { type: 'Favor', id: 'pendingFavor' }
            ]
        })
    })
});

export const {
    useGetFavorSummaryQuery,
    useGetFavorHistoryQuery,
    useGetPendingFavorQuery,
    useMakeFavorRequestMutation,
    useResponseFavorMutation
} = favorApiSlice;

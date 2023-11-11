import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setToken, setLogout } from 'app/features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        const refreshResult = await baseQuery('auth/refresh', api, extraOptions);

        if (refreshResult?.data) {
            api.dispatch(setToken(refreshResult.data.accessToken));
            result = await baseQuery(args, api, extraOptions);
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = 'Your login has expired.';
            }

            api.dispatch(setLogout());
            return refreshResult;
        }
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: 'bbcApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['User', 'Favor', 'Debt', 'Repay', 'Contact', 'Messenger', 'Notification', 'Pokegene'],
    endpoints: (builder) => ({})
});

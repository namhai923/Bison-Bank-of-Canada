import { apiSlice } from 'app/api/apiSlice';
import { setToken, setLogout } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    let result = await queryFulfilled;
                    dispatch(setToken(result.data.accessToken));
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    let result = await queryFulfilled;
                    dispatch(setToken(result.data.accessToken));
                } catch (err) {
                    console.log(err);
                }
            }
        }),

        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'GET'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(setLogout());
                    dispatch(apiSlice.util.resetApiState());
                } catch (err) {
                    console.log(err);
                }
            }
        })
    })
});

export const { useRefreshMutation, useRegisterMutation, useLoginMutation, useLogoutMutation } = authApiSlice;

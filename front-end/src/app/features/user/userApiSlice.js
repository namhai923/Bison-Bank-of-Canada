import jwtDecode from 'jwt-decode';

import { apiSlice } from 'app/api/apiSlice';
import store from 'app/store';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserInfo: builder.query({
            query: () => ({
                url: '/user/getInfo'
            }),
            providesTags: [{ type: 'User', id: 'userInfo' }]
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
        })
    })
});

export const { useGetUserInfoQuery, useSearchUserMutation, useUpdateUserInfoMutation } = userApiSlice;

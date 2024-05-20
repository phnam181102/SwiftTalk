import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn } from '../auth/authSlice';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    }),
    endpoints: (builder) => ({
        refreshToken: builder.query({
            query: (data) => ({
                url: 'user/refresh',
                method: 'GET',
                credentials: 'include',
            }),
        }),
        loadUser: builder.query({
            query: (userId) => ({
                url: `user/me/${userId}`,
                method: 'GET',
                credentials: 'include',
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data.accessToken,
                            user: result.data.user,
                        }),
                    );
                } catch (error) {
                    console.log(error);
                }
            },
        }),
    }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;

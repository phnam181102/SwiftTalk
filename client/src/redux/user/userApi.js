import { apiSlice } from '../features/api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUser: builder.query({
            query: ({ userId }) => ({
                url: `get-users/${userId}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        getGenerateTokenUser: builder.query({
            query: ({ userId }) => ({
                url: `generate-token-user/${userId}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
    }),
});

export const { useGetAllUserQuery, useGetGenerateTokenUserQuery } = userApi;

import { apiSlice } from '../features/api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUser: builder.query({
            query: ({ userId }) => ({
                url: `user/get-users/${userId}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        updateProfile: builder.mutation({
            query: ({ formData, userId }) => ({
                url: `user/update-profile/${userId}`,
                method: 'PUT',
                credentials: 'include',
                body: formData,
            }),
        }),
        getGenerateTokenUser: builder.query({
            query: ({ userId }) => ({
                url: `user/generate-token-user/${userId}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        findUserByKeyword: builder.query({
            query: () => ({
                url: `user`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
    }),
});

export const { useGetAllUserQuery, useGetGenerateTokenUserQuery, useUpdateProfileMutation, useFindUserByKeywordQuery } =
    userApi;

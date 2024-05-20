import { apiSlice } from '../api/apiSlice';
import { userLoggedIn, userLoggedOut, userRegistration } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: 'auth/register',
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: 'auth/login',
                method: 'POST',
                body: {
                    email,
                    password,
                },
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
                    console.log(error.message);
                }
            },
        }),
        socialAuth: builder.mutation({
            query: ({ email, name, profilePicture }) => ({
                url: 'auth/social-auth',
                method: 'POST',
                body: {
                    email,
                    name,
                    profilePicture,
                },
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
                    console.log(error.message);
                }
            },
        }),
        logOut: builder.query({
            query: () => ({
                url: 'auth/logout',
                method: 'GET',
                credentials: 'include',
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error.message);
                }
            },
        }),
    }),
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation, useSocialAuthMutation, useLogOutQuery } =
    authApi;

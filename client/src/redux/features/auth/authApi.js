import { apiSlice } from '../api/apiSlice';
import { userLoggedIn, userLoggedOut, userRegistration } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: 'register',
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: 'login',
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
                            token: result.data.token,
                            user: result.data.user,
                        })
                    );
                } catch (error) {
                    console.log(error.message);
                }
            },
        }),
        // logOut: builder.query({
        //     query: () => ({
        //         url: 'logout',
        //         method: 'GET',
        //         credentials: 'include' as const,
        //     }),
        //     async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        //         try {
        //             dispatch(userLoggedOut());
        //         } catch (error: any) {
        //             console.log(error.message);
        //         }
        //     },
        // }),
    }),
});

export const {
    useRegisterMutation,
    useActivationMutation,
    useLoginMutation,
    useSocialAuthMutation,
    useLogOutQuery,
} = authApi;

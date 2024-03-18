import { apiSlice } from '../features/api/apiSlice';

import { showAllContactsPage } from './userSlice';

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUser: builder.query({
            query: () => ({
                url: 'get-users',
                method: 'GET',
                credentials: 'include',
            }),
        }),
    }),
});

export const { useGetAllUserQuery } = userApi;

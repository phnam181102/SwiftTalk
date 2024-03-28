import { apiSlice } from '../features/api/apiSlice';

export const messageApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addMessage: builder.mutation({
            query: ({ from, to, message }) => ({
                url: 'add-message',
                method: 'POST',
                body: { from, to, message },
                credentials: 'include',
            }),
        }),
        getMessages: builder.query({
            query: ({ from, to }) => ({
                url: `get-messages/${from}/${to}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
    }),
});

export const { useAddMessageMutation, useGetMessagesQuery } = messageApi;

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
        getInitialContact: builder.query({
            query: ({ from }) => ({
                url: `get-initial-contacts/${from}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        addImageMessage: builder.mutation({
            query: ({ formData, from, to }) => {
                return {
                    url: `add-image-message`,
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                    params: {
                        from,
                        to,
                    },
                };
            },
        }),
        addAudioMessage: builder.mutation({
            query: ({ formData, from, to }) => {
                return {
                    url: `add-audio-message`,
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                    params: {
                        from,
                        to,
                    },
                };
            },
        }),
    }),
});

export const {
    useAddMessageMutation,
    useGetMessagesQuery,
    useGetInitialContactQuery,
    useAddImageMessageMutation,
    useAddAudioMessageMutation,
} = messageApi;

import { apiSlice } from '../features/api/apiSlice';

export const messageApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addMessage: builder.mutation({
            query: ({ from, to, message }) => ({
                url: 'message/add-message',
                method: 'POST',
                body: { from, to, message },
                credentials: 'include',
            }),
        }),
        getMessages: builder.query({
            query: ({ from, to }) => ({
                url: `message/get-messages/${from}/${to}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        createGroup: builder.mutation({
            query: ({ formData }) => ({
                url: 'message/create-group',
                method: 'POST',
                credentials: 'include',
                body: formData,
            }),
        }),
        getInitialContact: builder.query({
            query: ({ from }) => ({
                url: `message/get-initial-contacts/${from}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        addImageMessage: builder.mutation({
            query: ({ formData, from, to }) => {
                return {
                    url: `message/add-image-message`,
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
                    url: `message/add-audio-message`,
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
    useCreateGroupMutation,
} = messageApi;

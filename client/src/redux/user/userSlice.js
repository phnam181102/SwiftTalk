import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contactsPage: false,
    currentChatUser: undefined,
    messages: [],
    socket: undefined,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        showAllContactsPage: (state) => {
            state.contactsPage = !state.contactsPage;
        },
        changeCurrentChatUser: (state, action) => {
            state.currentChatUser = action.payload.user;
        },
        setMessages: (state, action) => {
            state.messages = action.payload.messages;
        },
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload.newMessage];
        },
        setSocket: (state, action) => {
            state.socket = action.payload.socket;
        },
    },
});

export const {
    showAllContactsPage,
    changeCurrentChatUser,
    setMessages,
    setSocket,
    addMessage,
} = userSlice.actions;

export default userSlice.reducer;

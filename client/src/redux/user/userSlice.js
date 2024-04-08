import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contactsPage: false,
    currentChatUser: undefined,
    messages: [],
    socket: undefined,
    userContacts: [],
    onlineUsers: [],
    filteredContacts: [],
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
        setUserContacts: (state, action) => {
            state.userContacts = action.payload.userContacts;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload.onlineUsers;
        },
        setContactSearch: (state, action) => {
            const filteredContacts = state.userContacts.filter((contact) =>
                contact.name.toLowerCase().includes(action.payload.contactSearch.toLowerCase()),
            );

            return {
                ...state,
                contactSearch: action.payload.contactSearch,
                filteredContacts,
            };
        },
    },
});

export const {
    showAllContactsPage,
    changeCurrentChatUser,
    setMessages,
    setSocket,
    addMessage,
    setUserContacts,
    setOnlineUsers,
    setContactSearch,
} = userSlice.actions;

export default userSlice.reducer;

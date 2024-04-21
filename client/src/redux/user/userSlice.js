import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contactsPage: false,
    currentChatUser: undefined,
    messages: [],
    socket: undefined,
    userContacts: [],
    allContacts: [],
    onlineUsers: [],
    filteredContacts: [],
    filteredAllContacts: [],
    messagesSearch: false,
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
        setAllContacts: (state, action) => {
            state.allContacts = action.payload.allContacts;
        },
        setContactSearch: (state, action) => {
            const { contactSearch } = action.payload;

            if (state.contactsPage) {
                let filteredAllContacts = [];
                if (contactSearch && contactSearch.length > 0) {
                    if (contactSearch.startsWith('@')) {
                        // Nếu tìm kiếm bắt đầu bằng @ thì tìm theo username
                        const usernameSearch = contactSearch.slice(1).toLowerCase();
                        filteredAllContacts = state.allContacts.filter((contact) =>
                            contact.username.toLowerCase().startsWith(usernameSearch),
                        );
                    } else {
                        // Ngược lại, tìm kiếm bằng tên
                        filteredAllContacts = state.allContacts.filter((contact) =>
                            contact.name.toLowerCase().includes(contactSearch.toLowerCase()),
                        );
                    }
                }
                return { ...state, contactSearch, filteredAllContacts };
            } else {
                const filteredContacts = state.userContacts.filter((contact) =>
                    contact.name.toLowerCase().includes(contactSearch.toLowerCase()),
                );
                return { ...state, contactSearch, filteredContacts };
            }
        },
        clearFilteredContacts: (state) => {
            return { ...state, filteredContacts: [], filteredAllContacts: [] };
        },
        setMessageSearch: (state) => {
            state.messagesSearch = !state.messagesSearch;
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
    setAllContacts,
    setContactSearch,
    setMessageSearch,
    clearFilteredContacts,
} = userSlice.actions;

export default userSlice.reducer;

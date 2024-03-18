import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contactsPage: false,
    currentChatUser: undefined,
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
    },
});

export const { showAllContactsPage, changeCurrentChatUser } = userSlice.actions;

export default userSlice.reducer;

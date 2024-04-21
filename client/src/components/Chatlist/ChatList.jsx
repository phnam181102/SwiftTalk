import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ContactsList from '@/components/Chatlist/ContactsList';
import ChatListHeader from './ChatListHeader';
import SearchBar from './SearchBar';
import List from './List';
import { setContactSearch } from '../../redux/user/userSlice';

function ChatList() {
    const dispatch = useDispatch();

    const { contactsPage } = useSelector((state) => state.user);

    const handleOnChange = (e) => {
        dispatch(setContactSearch({ contactSearch: e.target.value }));
    };

    return (
        <div className="background-red-200 flex flex-col max-h-screen z-20">
            {!contactsPage ? (
                <>
                    <ChatListHeader />
                    <SearchBar placeholder="Search or start new chat" handleOnChange={handleOnChange} />
                    <List />
                </>
            ) : (
                <ContactsList />
            )}
        </div>
    );
}

export default ChatList;

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import ContactsList from '@/components/Chatlist/ContactsList';
import ChatListHeader from './ChatListHeader';
import SearchBar from './SearchBar';
import List from './List';

function ChatList() {
    const { contactsPage } = useSelector((state) => state.user);

    return (
        <div className="background-red-200 flex flex-col max-h-screen z-20">
            {!contactsPage ? (
                <>
                    <ChatListHeader />
                    <SearchBar placeholder="Search or start new chat" />
                    <List />
                </>
            ) : (
                <ContactsList />
            )}
        </div>
    );
}

export default ChatList;

import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch } from 'react-redux';

import { useGetAllUserQuery } from '@/redux/user/userApi';
import { showAllContactsPage } from '@/redux/user/userSlice';
import SearchBar from './SearchBar';
import ChatListItem from './ChatLIstItem';

function ContactsList() {
    const {
        data: { users: allContacts },
        isLoading,
        isError,
    } = useGetAllUserQuery();
    const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(showAllContactsPage());
    };

    return (
        <div className="h-full flex flex-col">
            <div className="h-20 flex items-center py-5 px-4">
                <div className="flex items-center gap-8 font-medium text-light">
                    <IoIosArrowBack
                        className="cursor-pointer text-xl"
                        onClick={handleBack}
                    />
                    <span className="text-lg">New Chat</span>
                </div>
            </div>
            <SearchBar placeholder="Search contacts" />
            {Object.entries(allContacts).map(([initialLetter, userList]) => {
                return (
                    <div key={Date.now() + initialLetter}>
                        <div className="text-light pl-10 py-5 text-lg font-medium">
                            {initialLetter}
                        </div>
                        {userList.map((contact, i) => {
                            return (
                                <ChatListItem
                                    data={contact}
                                    isContactsPage={true}
                                    key={i}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default ContactsList;

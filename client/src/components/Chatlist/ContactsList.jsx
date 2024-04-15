import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';

import { useGetAllUserQuery } from '@/redux/user/userApi';
import { showAllContactsPage } from '@/redux/user/userSlice';
import SearchBar from './SearchBar';
import ChatListItem from './ChatLIstItem';

function ContactsList() {
    const { user } = useSelector((state) => state.auth);
    console.log(user?.id);
    const { data } = useGetAllUserQuery({ userId: user?.id }); // Sử dụng optional chaining để tránh lỗi
    const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(showAllContactsPage());
    };

    const allContacts = data?.users;
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
            {allContacts &&
                Object.entries(allContacts).map(([initialLetter, userList]) => {
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

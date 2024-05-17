import React, { useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';

import { useGetAllUserQuery } from '@/redux/user/userApi';
import { showAllContactsPage } from '@/redux/user/userSlice';
import SearchBar from './SearchBar';
import ChatListItem from './ChatLIstItem';
import { clearFilteredContacts, setAllContacts, setContactSearch } from '../../redux/user/userSlice';
import { convertToFlatObject } from '../../utils/convertToFlatObject';

function ContactsList() {
    const { allContacts, filteredAllContacts } = useSelector((state) => state.user);

    const { user } = useSelector((state) => state.auth);
    const { data } = useGetAllUserQuery({ userId: user?.id }); // Sử dụng optional chaining để tránh lỗi
    const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(showAllContactsPage());
        dispatch(clearFilteredContacts());
    };

    useEffect(() => {
        if (data) {
            dispatch(setAllContacts({ allContacts: convertToFlatObject(data.users) }));
        }
    }, [data, dispatch]);

    const handleOnChange = (e) => {
        dispatch(setContactSearch({ contactSearch: e.target.value }));
    };

    return (
        <div className="h-full flex flex-col">
            <div className="h-20 flex items-center py-5 px-4">
                <div className="flex items-center gap-8 font-medium text-light">
                    <IoIosArrowBack className="cursor-pointer text-xl" onClick={handleBack} />
                    <span className="text-lg">New Chat</span>
                </div>
            </div>

            <SearchBar placeholder="Search contacts" handleOnChange={handleOnChange} />

            {filteredAllContacts && filteredAllContacts.length > 0 ? (
                <div className="py-6">
                    {filteredAllContacts.map((contact, i) => {
                        return <ChatListItem data={contact} isContactsPage={true} key={i} />;
                    })}
                </div>
            ) : (
                data?.users &&
                Object.entries(data?.users).map(([initialLetter, userList]) => {
                    return (
                        <div key={Date.now() + initialLetter}>
                            <div className="text-light pl-10 pt-5 pb-3 text-lg font-medium">{initialLetter}</div>
                            {userList.map((contact, i) => {
                                return <ChatListItem data={contact} isContactsPage={true} key={i} />;
                            })}
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default ContactsList;

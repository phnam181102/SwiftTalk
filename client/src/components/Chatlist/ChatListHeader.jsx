import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';

import { useGetAllUserQuery } from '@/redux/user/userApi';
import Avatar from '../common/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { showAllContactsPage } from '@/redux/user/userSlice';

function ChatListHeader() {
    const { data: users, isLoading, isError } = useGetAllUserQuery();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleAllContactsPage = () => {
        dispatch(showAllContactsPage());
    };

    return (
        <div className="px-6 py-5 flex justify-between items-center">
            <div className="cursor-pointer">
                <Avatar type="sm" image="/default_avatar.png" />
            </div>

            <div className="flex gap-6">
                <FiEdit
                    className="text-light cursor-pointer text-xl"
                    title="New Chat"
                    onClick={handleAllContactsPage}
                />
                <BsThreeDotsVertical
                    className="text-light cursor-pointer text-xl"
                    title="Menu"
                />
            </div>
        </div>
    );
}

export default ChatListHeader;

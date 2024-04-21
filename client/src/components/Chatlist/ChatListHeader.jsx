import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';

import Avatar from '../common/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { showAllContactsPage } from '@/redux/user/userSlice';
import { clearFilteredContacts } from '../../redux/user/userSlice';

function ChatListHeader() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleAllContactsPage = () => {
        dispatch(showAllContactsPage());
        dispatch(clearFilteredContacts());
    };

    return (
        <div className="px-6 py-5 flex justify-between items-center">
            <div className="flex gap-2 items-center">
                <div className="cursor-pointer">
                    <Avatar type="sm" image="/default_avatar.png" />
                </div>
                <p>{user.name}</p>
            </div>

            <div className="flex gap-6">
                <FiEdit
                    className="text-light cursor-pointer text-xl"
                    title="New Chat"
                    onClick={handleAllContactsPage}
                />
                <BsThreeDotsVertical className="text-light cursor-pointer text-xl" title="Menu" />
            </div>
        </div>
    );
}

export default ChatListHeader;

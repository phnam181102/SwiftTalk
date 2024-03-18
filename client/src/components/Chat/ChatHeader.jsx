import React from 'react';
import { IoVideocamOutline } from 'react-icons/io5';
import { BsThreeDotsVertical, BsTelephone } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';

import Avatar from '../common/Avatar';
import { useSelector } from 'react-redux';

function ChatHeader() {
    const { currentChatUser } = useSelector((state) => state.user);

    return (
        <div className="h-20 px-5 py-4 flex justify-between items-center bg-white z-10">
            <div className="flex items-center justify-center gap-6">
                <Avatar type="sm" image={'/default_avatar.png'} />

                <div className="flex flex-col ">
                    <span className="text-dark text-xl leading-5">
                        {currentChatUser?.name}
                    </span>
                    <span className="text-gray text-sm leading-6">online</span>
                </div>
            </div>

            <div className="flex gap-6 items-center">
                <BsTelephone className="text-gray cursor-pointer text-2xl " />
                <IoVideocamOutline className="text-gray cursor-pointer text-3xl " />
                <FiSearch className="text-gray cursor-pointer text-2xl " />
                <BsThreeDotsVertical className="text-gray cursor-pointer text-2xl " />
            </div>
        </div>
    );
}

export default ChatHeader;

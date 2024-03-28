import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '../common/Avatar';
import { changeCurrentChatUser } from '@/redux/user/userSlice';
import { showAllContactsPage } from '../../redux/user/userSlice';

function ChatListItem({ data, isContactsPage = false }) {
    const { currentChatUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleContactClick = () => {
        if (currentChatUser?.id !== data?.id) {
            dispatch(changeCurrentChatUser({ user: data }));
            dispatch(showAllContactsPage());
        }
    };

    return (
        <div
            className="flex cursor-pointer items-center hover:bg-gray"
            onClick={handleContactClick}
        >
            <div className="min-w-fit px-5 pt-3 pb-1">
                <Avatar type="lg" image={'/default_avatar.png'} />
            </div>

            <div className="min-h-full flex flex-col justify-center pr-2  w-full">
                <div className="flex justify-between mt-2">
                    <div>
                        <span className="text-light">{data?.name}</span>
                    </div>
                </div>

                <div className="flex pb-2 pt-1 ">
                    <div className="flex justify-between w-full">
                        <span className="text-primary-200 line-clamp-1 text-sm">
                            @username
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatListItem;

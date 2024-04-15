import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '../common/Avatar';
import { changeCurrentChatUser } from '@/redux/user/userSlice';
import { showAllContactsPage } from '../../redux/user/userSlice';
import { calculateTime } from '../../utils/CalculateTime';
import MessageStatus from '../common/MessageStatus';

function ChatListItem({ data, isContactsPage = false }) {
    const { user } = useSelector((state) => state.auth);
    const { currentChatUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleContactClick = () => {
        // if (currentChatUser?.id !== data?.id) {
        if (!isContactsPage) {
            dispatch(
                changeCurrentChatUser({
                    user: {
                        name: data.name,
                        email: data.email,
                        id: user.id === data.senderId ? data.receiverId : data.senderId,
                    },
                }),
            );
        } else {
            dispatch(changeCurrentChatUser({ user: data }));
            dispatch(showAllContactsPage());
        }
        // }
    };

    return (
        <div className="flex cursor-pointer items-center hover:bg-gray" onClick={handleContactClick}>
            <div className="min-w-fit px-5 pt-3 pb-1">
                <Avatar type="lg" image={'/default_avatar.png'} />
            </div>

            <div className="min-h-full flex flex-col justify-center pr-2  w-full mr-6">
                <div className="flex justify-between mt-2">
                    <div>
                        <span className="text-light">{data?.name}</span>
                    </div>
                    {!isContactsPage && (
                        <div>
                            <span
                                className={`${
                                    !data.totalUnreadMessages > 0 ? 'text-gray' : 'text-primary-300'
                                } text-sm`}
                            >
                                {calculateTime(data.createdAt)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex pb-2 pt-1 ">
                    <div className="flex justify-between w-full">
                        <span className="text-primary-200 line-clamp-1 text-sm">
                            {isContactsPage ? (
                                '@username'
                            ) : (
                                <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px]">
                                    {data.senderId === user.id && <MessageStatus messageStatus={data.message} />}
                                    {data.type === 'text' && <span className="truncate">{data.message}</span>}
                                </div>
                            )}
                        </span>
                        {data.totalUnreadMessages > 0 && (
                            <span className="bg-primary-300 px-[5px] rounded-full text-sm">
                                {data.totalUnreadMessages}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatListItem;

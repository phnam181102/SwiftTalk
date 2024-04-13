import React from 'react';
import Image from 'next/image';
import { calculateTime } from '../../utils/CalculateTime';
import { useSelector } from 'react-redux';
import { HOST } from '@/utils/ApiRoutes';
import MessageStatus from '../common/MessageStatus';

function ImageMessage({ message }) {
    const { currentChatUser } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);

    return (
        <div className={`p-1 rounded-lg`}>
            <div className="relative">
                <Image src={`${HOST}/${message.message}`} className="rounded-lg" alt="asset" width={300} height={300} />
                <div className="absolute bottom-1 right-1 flex items-end gap-1">
                    <span
                        className={`text-gray text-[11px] pt-1 min-w-fit ${
                            message.senderId === currentChatUser.id ? 'text-gray' : ' text-light'
                        }`}
                    >
                        {calculateTime(message.createdAt)}
                    </span>
                    <span className="text-blue-400">
                        {message.senderId === user.id && <MessageStatus messageStatus={message.messageStatus} />}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ImageMessage;

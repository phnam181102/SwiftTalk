import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import { useGetMessagesQuery } from '../../redux/message/messageApi';
import Loader from '../Loader';
import MessageStatus from '../common/MessageStatus';
import { calculateTime } from '../../utils/CalculateTime';
import ImageMessage from './ImageMessage';

const VoiceMessage = dynamic(() => import('./VoiceMessage'), {
    ssr: false,
});

function ChatContainer({ socket }) {
    const { user } = useSelector((state) => state.auth);
    const { currentChatUser } = useSelector((state) => state.user);

    const {
        data: { messages } = {},
        isLoading,
        isError,
    } = useGetMessagesQuery({ from: user?.id, to: currentChatUser?.id }, { forceRefetch: true });

    useEffect(() => {
        if (messages) {
            socket.current.emit('join chat', currentChatUser?.id);
        }
    }, [messages]);

    return (
        <div className="bg-white h-[80px] w-full flex-grow overflow-auto custom-scrollbar">
            <div className="mx-10 my-6">
                <div className="flex w-full">
                    <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
                        {messages?.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.senderId === currentChatUser.id ? 'justify-start' : 'justify-end'
                                }`}
                            >
                                {message.type === 'text' && (
                                    <div
                                        className={` px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${
                                            message.senderId === currentChatUser.id
                                                ? 'bg-primary-100 text-dark'
                                                : 'bg-primary-300 text-light'
                                        }`}
                                    >
                                        <span className="break-all">{message.message}</span>
                                        <div className="flex gap-1 items-end">
                                            <span
                                                className={`text-gray text-[11px] pt-1 min-w-fit ${
                                                    message.senderId === currentChatUser.id
                                                        ? 'text-gray'
                                                        : ' text-light'
                                                }`}
                                            >
                                                {calculateTime(message.createdAt)}
                                            </span>
                                            <span>
                                                {message.senderId === user.id && (
                                                    <MessageStatus messageStatus={message.messageStatus} />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {message.type === 'image' && <ImageMessage message={message} />}
                                {message.type === 'audio' && <VoiceMessage message={message} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatContainer;

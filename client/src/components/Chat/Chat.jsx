import React, { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import MessageBar from './MessageBar';
import { useSelector } from 'react-redux';
import { useGetInitialContactQuery } from '@/redux/message/messageApi';

function Chat({ socket }) {
    const { currentChatUser } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);

    const { refetch } = useGetInitialContactQuery({ from: user?.id });

    useEffect(() => {
        refetch();
    }, []);

    return (
        <div className=" w-full bg-white flex flex-col h-[100vh] z-10 text-dark">
            <ChatHeader />
            <ChatContainer socket={socket} key={`cc${currentChatUser.id}`} />
            <MessageBar socket={socket} key={`mb${currentChatUser.id}`} />
        </div>
    );
}

export default Chat;

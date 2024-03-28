import React from 'react';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import MessageBar from './MessageBar';
import { useSelector } from 'react-redux';

function Chat({ socket }) {
    const { currentChatUser } = useSelector((state) => state.user);

    return (
        <div className=" w-full bg-white flex flex-col h-[100vh] z-10 text-dark">
            <ChatHeader />
            <ChatContainer key={`cc${currentChatUser.id}`} />
            <MessageBar socket={socket} key={`mb${currentChatUser.id}`} />
        </div>
    );
}

export default Chat;

import React from 'react';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import MessageBar from './MessageBar';

function Chat() {
    return (
        <div className=" w-full bg-white flex flex-col h-[100vh] z-10 text-dark">
            <ChatHeader />
            <ChatContainer />
            <MessageBar />
        </div>
    );
}

export default Chat;

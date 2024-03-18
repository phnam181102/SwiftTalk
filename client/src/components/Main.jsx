import React from 'react';
import { useSelector } from 'react-redux';

import Protected from '@/hooks/useProtected';
import ChatList from './Chatlist/ChatList';
import Empty from './Empty';
import Chat from './Chat/Chat';

function Main() {
    const { user } = useSelector((state) => state.auth);
    const { currentChatUser } = useSelector((state) => state.user);
    return (
        <Protected>
            <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
                <ChatList />
                {!currentChatUser ? <Empty /> : <Chat />}
            </div>
        </Protected>
    );
}

export default Main;

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import Protected from '@/hooks/useProtected';
import ChatList from './Chatlist/ChatList';
import Empty from './Empty';
import Chat from './Chat/Chat';
import { addMessage } from '../redux/user/userSlice';
import { HOST } from '../utils/ApiRoutes';
import { useGetMessagesQuery } from '../redux/message/messageApi';

function Main() {
    const { currentChatUser } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);
    const [socketEvent, setSocketEvent] = useState(false);

    const { refetch } = useGetMessagesQuery({
        from: user?.id,
        to: currentChatUser?.id,
    });

    const socket = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            socket.current = io(HOST);
            socket.current.emit('add-user', user.id);
        }
    }, [user]);

    useEffect(() => {
        if (socket.current && !socketEvent) {
            socket.current.on('msg-receive', (data) => {
                refetch();
                dispatch(
                    addMessage({
                        newMessage: {
                            ...data.message,
                        },
                    })
                );
            });
            setSocketEvent(true);
        }
    }, [socket.current]);

    return (
        <Protected>
            <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
                <ChatList />
                {!currentChatUser ? <Empty /> : <Chat socket={socket} />}
            </div>
        </Protected>
    );
}

export default Main;

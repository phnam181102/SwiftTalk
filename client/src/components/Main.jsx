import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import Protected from '@/hooks/useProtected';
import ChatList from './Chatlist/ChatList';
import Empty from './Empty';
import Chat from './Chat/Chat';
import SearchMessages from './Chat/SearchMessages';
import { addMessage } from '../redux/user/userSlice';
import { HOST } from '../utils/ApiRoutes';
import { useGetInitialContactQuery, useGetMessagesQuery } from '../redux/message/messageApi';

function Main() {
    const { currentChatUser, messagesSearch } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);
    const [socketEvent, setSocketEvent] = useState(false);

    const { refetch } = useGetMessagesQuery({
        from: user?.id,
        to: currentChatUser?.id,
    });

    const { refetch: refetchInitialContact } = useGetInitialContactQuery({ from: user?.id });

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
                refetchInitialContact();
                dispatch(
                    addMessage({
                        newMessage: {
                            ...data.message,
                        },
                    }),
                );
            });
            setSocketEvent(true);
        }
    }, [socket.current]);

    useEffect(() => {
        if (user?.id) {
            const userId = user.id;
            socket.current.emit('get-initial-contacts', { userId });
        }

        socket.current.on('get-initial-contacts-response', (userId) => {
            refetchInitialContact();
        });

        return () => {
            socket.current.off('get-initial-contacts-response');
        };
    }, [socket.current]);

    return (
        <Protected>
            <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
                <ChatList />
                {currentChatUser ? (
                    <div className={messagesSearch ? 'grid grid-cols-2' : 'grid-cols-2'}>
                        <Chat socket={socket} />
                        {messagesSearch && <SearchMessages />}
                    </div>
                ) : (
                    <Empty />
                )}
            </div>
        </Protected>
    );
}

export default Main;

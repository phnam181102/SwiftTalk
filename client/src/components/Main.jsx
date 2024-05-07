import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import Protected from '@/hooks/useProtected';
import ChatList from './Chatlist/ChatList';
import Empty from './Empty';
import Chat from './Chat/Chat';
import SearchMessages from './Chat/SearchMessages';
import { addMessage, endCall, setIncomingVideoCall, setIncomingVoiceCall } from '../redux/user/userSlice';
import { HOST } from '../utils/ApiRoutes';
import { useGetInitialContactQuery, useGetMessagesQuery } from '../redux/message/messageApi';
import VideoCall from './Call/VideoCall';
import VoiceCall from './Call/VoiceCall';
import IncomingVideoCall from './common/IncomingVideoCall';
import IncomingCall from './common/IncomingCall';

function Main() {
    const { currentChatUser, messagesSearch, videoCall, voiceCall, incomingVoiceCall, incomingVideoCall } = useSelector(
        (state) => state.user,
    );

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

            socket.current.on('incoming-voice-call', ({ from, roomId, callType }) => {
                dispatch(setIncomingVoiceCall({ incomingVoiceCall: { ...from, roomId, callType } }));
            });

            socket.current.on('incoming-video-call', ({ from, roomId, callType }) => {
                dispatch(setIncomingVideoCall({ incomingVideoCall: { ...from, roomId, callType } }));
            });

            socket.current.on('voice-call-rejected', () => {
                dispatch(endCall());
            });

            socket.current.on('video-call-rejected', () => {
                dispatch(endCall());
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
            {incomingVoiceCall && <IncomingCall socket={socket} />}

            {incomingVideoCall && <IncomingVideoCall socket={socket} />}

            {videoCall && (
                <div className="h-screen w-screen max-h-full overflow-hidden">
                    <VideoCall socket={socket} />
                </div>
            )}

            {voiceCall && (
                <div className="h-screen w-screen max-h-full overflow-hidden">
                    <VoiceCall socket={socket} />
                </div>
            )}

            {!videoCall && !voiceCall && (
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
            )}
        </Protected>
    );
}

export default Main;

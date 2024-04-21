import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
const Container = dynamic(() => import('./Container'), { ssr: false });

function VoiceCall({ socket }) {
    const { voiceCall } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (voiceCall.type === 'out-going') {
            socket.current.emit('outgoing-voice-call', {
                to: voiceCall.id,
                from: {
                    id: user.id,
                    // profilePicture: user.profilePicture,
                    name: user.name,
                },
                callType: voiceCall.callType,
                roomId: voiceCall.roomId,
            });
        }
    }, [voiceCall]);

    return <Container socket={socket} data={voiceCall} />;
}

export default VoiceCall;

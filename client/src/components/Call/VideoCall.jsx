import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
const Container = dynamic(() => import('./Container'), { ssr: false });

function VideoCall({ socket }) {
    const { videoCall } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (videoCall.type === 'out-going') {
            socket.current.emit('outgoing-video-call', {
                to: videoCall.id,
                from: {
                    id: user.id,
                    // profilePicture: user.profilePicture,
                    name: user.name,
                },
                callType: videoCall.callType,
                roomId: videoCall.roomId,
            });
        }
    }, [videoCall]);

    return <Container socket={socket} data={videoCall} />;
}

export default VideoCall;

import Image from 'next/image';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { endCall, setIncomingVideoCall, setVideoCall } from '../../redux/user/userSlice';

function IncomingVideoCall({ socket }) {
    const { incomingVideoCall } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const acceptCall = () => {
        dispatch(setVideoCall({ videoCall: { ...incomingVideoCall, type: 'in-coming' } }));
        socket.current.emit('accept-incoming-call', { id: incomingVideoCall.id });
        dispatch(setIncomingVideoCall({ incomingVideoCall: undefined }));
    };

    const rejectCall = () => {
        socket.current.emit('reject-video-call', { from: incomingVideoCall.id });
        dispatch(endCall());
    };

    return (
        <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-lg flex gap-5 items-center justify-start p-4 text-white bg-dark drop-shadow-2xl border-2 py-14">
            <Image
                // src={IncomingVideoCall.profilePicture}
                src="/default_avatar.png"
                alt="Avatar"
                width={70}
                height={70}
                className="rounded-full"
            />
            <div>
                <div>{incomingVideoCall?.name}</div>
                <div className="text-xs">Incoming Video Call</div>
                <div className="flex gap-2 mt-2">
                    <button className="bg-red-500 p-1 px-3 text-sm rounded-full" onClick={rejectCall}>
                        Reject
                    </button>
                    <button className="bg-green-500 p-1 px-3 text-sm rounded-full" onClick={acceptCall}>
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IncomingVideoCall;

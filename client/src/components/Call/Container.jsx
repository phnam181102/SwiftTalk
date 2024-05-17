'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

import { MdOutlineCallEnd } from 'react-icons/md';
import { endCall } from '../../redux/user/userSlice';

import { useGetGenerateTokenUserQuery } from '@/redux/user/userApi';

function randomID(len) {
    let result = '';
    if (result) return result;
    var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
        maxPos = chars.length,
        i;
    len = len || 5;
    for (i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

export function getUrlParams(url = window.location.href) {
    let urlStr = url.split('?')[1];
    return new URLSearchParams(urlStr);
}

function Container({ socket, data }) {
    const { user } = useSelector((state) => state.auth);
    const [callAccepted, setCallAccepted] = useState(false);
    const [zgVar, setZgVar] = useState(undefined);
    const [localStream, setLocalStream] = useState(undefined);
    const [publishStream, setPublishStream] = useState(undefined);
    const dispatch = useDispatch();

    const { data: token } = useGetGenerateTokenUserQuery({ userId: user?.id });

    useEffect(() => {
        if (data.type === 'outgoing') {
            socket.current.on('accept-call', () => setCallAccepted(true));
        } else {
            setTimeout(() => {
                setCallAccepted(true);
            }, 1000);
        }
    }, [data]);

    const roomID = 'YKCcT';
    let myMeeting = async (element) => {
        // generate Kit Token
        const appID = process.env.NEXT_PUBLIC_ZEGO_APP_ID;
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_ID;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), user.name);

        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: element,
            showPreJoinView: false,
            sharedLinks: [
                {
                    name: 'Personal link',
                    url:
                        window.location.protocol +
                        '//' +
                        window.location.host +
                        window.location.pathname +
                        '?roomID=' +
                        roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showTextChat: false,
            showUserList: false,
            // onLeaveRoom: () => {
            //     zp.logoutRoom();
            //     handleEndCall();
            // },
        });
    };

    useEffect(() => {
        const startCall = async () => {
            myMeeting();
        };
        if (token) {
            startCall();
        }
    }, [token]);

    const handleEndCall = () => {
        const id = data.id;

        if (zgVar && localStream && publishStream) {
            zgVar.destroyStream(localStream);
            zgVar.stopPublishingStream(publishStream);
            zgVar.logoutRoom(data.roomId.toString());
        }

        if (data.callType === 'voice') {
            socket.current.emit('reject-voice-call', {
                from: id,
            });
        } else {
            socket.current.emit('reject-video-call', {
                from: id,
            });
        }
        dispatch(endCall());
    };

    return (
        <div className="border-1 w-full flex flex-col h-[100vh] overflow-hidden justify-center items-center text-white">
            <div className="flex flex-col gap-3 items-center">
                <span className="text-5xl">{data.name}</span>
                <span className="text-lg">
                    {callAccepted && data.callType !== 'video' ? 'On going call' : 'Calling'}
                </span>
            </div>
            {(!callAccepted || data.callType === 'audio') && (
                <div className="my-8">
                    <Image src="/default_avatar.png" alt="Avatar" width={300} height={300} className="rounded-full" />
                </div>
            )}
            <div className="my-5 relative" id="remote-video" ref={myMeeting}>
                <div className="absolute bottom-5 right-5" id="local-audio"></div>
            </div>
            <button
                className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full hover:bg-red-500 cursor-pointer"
                onClick={handleEndCall}
            >
                <MdOutlineCallEnd className="text-3xl" />
            </button>
        </div>
    );
}

export default Container;

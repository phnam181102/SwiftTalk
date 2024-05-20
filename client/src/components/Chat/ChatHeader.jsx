import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IoVideocamOutline } from 'react-icons/io5';
import { BsThreeDotsVertical, BsTelephone } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';

import { HOST } from '@/utils/ApiRoutes';
import Avatar from '../common/Avatar';
import { setMessageSearch, setVideoCall, setVoiceCall } from '../../redux/user/userSlice';

function ChatHeader() {
    const dispatch = useDispatch();
    const { currentChatUser } = useSelector((state) => state.user);

    const handleMessageSearch = () => {
        dispatch(setMessageSearch());
    };

    const handleVoiceCall = () => {
        dispatch(
            setVoiceCall({
                voiceCall: {
                    ...currentChatUser,
                    type: 'out-going',
                    callType: 'voice',
                    roomId: Date.now(),
                },
            }),
        );
    };

    const handleVideoCall = () => {
        dispatch(
            setVideoCall({
                videoCall: {
                    ...currentChatUser,
                    type: 'out-going',
                    callType: 'video',
                    roomId: Date.now(),
                },
            }),
        );
    };

    return (
        <div className="h-20 px-5 py-4 flex justify-between shadow-[0_8px_24px_0_rgba(149,157,165,0.2)] items-center bg-white z-10">
            <div className="flex items-center justify-center gap-6">
                <Avatar
                    type="sm"
                    image={
                        currentChatUser?.profilePicture
                            ? `${HOST}/${currentChatUser.profilePicture}`
                            : '/default_avatar.png'
                    }
                />

                <div className="flex flex-col ">
                    <span className="text-dark text-xl leading-5">{currentChatUser?.name}</span>
                    <span className="text-gray text-sm leading-6">online</span>
                </div>
            </div>

            <div className="flex gap-6 items-center">
                <BsTelephone className="text-gray cursor-pointer text-2xl " onClick={handleVoiceCall} />
                <IoVideocamOutline className="text-gray cursor-pointer text-3xl " onClick={handleVideoCall} />
                <FiSearch className="text-gray cursor-pointer text-2xl" onClick={handleMessageSearch} />
                <BsThreeDotsVertical className="text-gray cursor-pointer text-2xl " />
            </div>
        </div>
    );
}

export default ChatHeader;

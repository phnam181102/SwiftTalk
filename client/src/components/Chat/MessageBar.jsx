import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import { BsEmojiSmile } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { GrMicrophone } from 'react-icons/gr';
import { ImAttachment } from 'react-icons/im';
import EmojiPicker from 'emoji-picker-react';

import {
    useAddMessageMutation,
    useAddImageMessageMutation,
    useGetMessagesQuery,
    useGetInitialContactQuery,
} from '@/redux/message/messageApi';
import { useRef } from 'react';
import { useEffect } from 'react';
import PhotoPicker from '../common/PhotoPicker';
import { createFormData } from '../../utils/createFormData';

const CaptureAudio = dynamic(() => import('../common/CaptureAudio'), {
    ssr: false,
});

function MessageBar({ socket }) {
    const { currentChatUser } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);

    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmokiPicker] = useState(false);
    const [grabPhoto, setGrabPhoto] = useState(false);
    const [showAudioRecorder, setShowAudioRecorder] = useState(false);
    const emojiPickerRef = useRef(null);

    const [addMessageMutation] = useAddMessageMutation();
    const [addImageMessageMutation] = useAddImageMessageMutation();
    const { refetch } = useGetMessagesQuery({
        from: user?.id,
        to: currentChatUser?.id,
    });

    const { refetch: refetchInitialContact } = useGetInitialContactQuery({ from: user?.id });

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (e.target.id !== 'emoji-open') {
                if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                    setShowEmokiPicker(false);
                }
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleEmojiModal = () => {
        setShowEmokiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (emoji) => {
        setMessage((prevMessage) => (prevMessage += emoji.emoji));
    };

    const photoPickerChange = async (e) => {
        try {
            const file = e.target.files[0];
            const formData = createFormData('image', file);
            const from = user?.id;
            const to = currentChatUser?.id;
            const { data } = await addImageMessageMutation({ formData, from, to });

            if (data) {
                socket.current.emit('send-msg', {
                    from: user?.id,
                    to: currentChatUser?.id,
                    message: data.message,
                });
                refetch();
                refetchInitialContact();
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await sendMessage();
        }
    };

    const sendMessage = async () => {
        setMessage('');

        try {
            const { data } = await addMessageMutation({
                from: user?.id,
                to: currentChatUser?.id,
                message,
            });
            socket.current.emit('send-msg', {
                from: user?.id,
                to: currentChatUser?.id,
                message: data.message,
            });
            refetch();
            refetchInitialContact();
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (grabPhoto) {
            const data = document.getElementById('photo-picker');
            data.click();
            document.body.onfocus = (e) => {
                setTimeout(() => {
                    setGrabPhoto(false);
                }, 1000);
            };
        }
    }, [grabPhoto]);

    return (
        <div className="bg-primary-100 py-2 px-6 mx-12 mb-4 flex items-center gap-6 rounded-lg relative">
            {!showAudioRecorder && (
                <>
                    <div className="flex gap-6">
                        <BsEmojiSmile
                            className="text-primary-300 cursor-pointer font-medium text-xl stroke-[0.4px]"
                            title="Emoji"
                            id="emoji-open"
                            onClick={handleEmojiModal}
                        />
                        {showEmojiPicker && (
                            <div className="absolute bottom-16 left-6 z-40" ref={emojiPickerRef}>
                                <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" />
                            </div>
                        )}
                        <ImAttachment
                            className="text-primary-300 cursor-pointer text-xl"
                            title="Attach File"
                            onClick={() => setGrabPhoto(true)}
                        />
                        <GrMicrophone
                            className="text-primary-300 cursor-pointer text-xl"
                            title="Record"
                            onClick={() => setShowAudioRecorder(true)}
                        />
                    </div>

                    <div className="w-full rounded-lg h-10 flex items-center">
                        <input
                            type="text"
                            placeholder="Type message..."
                            className="bg-primary-100 text-sm focus:outline-none text-dark w-full h-10 rounded-lg px-3 py-4"
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="flex w-10 items-center justify-center">
                        <button>
                            <IoSend
                                className="text-primary-300 cursor-pointer text-2xl hover:text-[#5f61ed]"
                                title="Send Message"
                                onClick={sendMessage}
                            />
                        </button>
                    </div>
                </>
            )}

            {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
            {showAudioRecorder && (
                <CaptureAudio
                    hide={() => setShowAudioRecorder(false)}
                    socket={socket}
                    onChange={setShowAudioRecorder}
                />
            )}
        </div>
    );
}

export default MessageBar;

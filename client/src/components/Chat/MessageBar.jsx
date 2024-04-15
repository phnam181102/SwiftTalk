import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BsEmojiSmile } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { GrMicrophone } from 'react-icons/gr';
import { ImAttachment } from 'react-icons/im';

import { useAddMessageMutation } from '@/redux/message/messageApi';
import { addMessage } from '../../redux/user/userSlice';
import { useGetMessagesQuery } from '../../redux/message/messageApi';

function MessageBar({ socket }) {
    const { currentChatUser } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);

    const [message, setMessage] = useState('');
    const [addMessageMutation] = useAddMessageMutation();
    const { refetch } = useGetMessagesQuery({
        from: user?.id,
        to: currentChatUser?.id,
    });

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
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="bg-primary-100 py-2 px-6 mx-12 mb-4 flex items-center gap-6 rounded-lg relative">
            <div className="flex gap-6">
                <BsEmojiSmile
                    className="text-primary-300 cursor-pointer font-medium text-xl stroke-[0.4px]"
                    title="Emoji"
                />
                <ImAttachment
                    className="text-primary-300 cursor-pointer text-xl"
                    title="Attach File"
                />
                <GrMicrophone
                    className="text-primary-300 cursor-pointer text-xl"
                    title="Record"
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
        </div>
    );
}

export default MessageBar;

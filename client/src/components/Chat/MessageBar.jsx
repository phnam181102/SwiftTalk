import React from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { GrMicrophone } from 'react-icons/gr';
import { ImAttachment } from 'react-icons/im';
function MessageBar() {
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
                />
            </div>

            <div className="flex w-10 items-center justify-center">
                <button>
                    <IoSend
                        className="text-primary-300 cursor-pointer text-2xl"
                        title="Send Message"
                    />
                </button>
            </div>
        </div>
    );
}

export default MessageBar;

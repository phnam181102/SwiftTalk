import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { setMessageSearch } from '../../redux/user/userSlice';
import { FiSearch } from 'react-icons/fi';
import { calculateTime } from '../../utils/CalculateTime';

function SearchMessages() {
    const { currentChatUser, messages } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedMessages, setSearchedMessages] = useState([]);

    const dispatch = useDispatch();

    const handleMessageSearch = () => {
        dispatch(setMessageSearch());
    };

    useEffect(() => {
        if (searchTerm) {
            setSearchedMessages(
                messages.filter((message) => message.type === 'text' && message.message.includes(searchTerm)),
            );
        } else {
            setSearchedMessages([]);
        }
    }, [searchTerm]);

    return (
        <div className="border-conversation-border border-l w-full bg-white flex flex-col z-10 max-h-screen">
            <div className="h-16 px-4 py-5 flex gap-10 items-center bg-primary-300">
                <IoClose className="cursor-pointer text-2xl" onClick={handleMessageSearch} />

                <span>Search Messages</span>
            </div>

            <div className="overflow-auto custom-scrollbar h-full">
                <div className="flex items-center flex-col w-full">
                    <div className="flex px-5 items-center gap-3 h-14 w-full">
                        <div className="bg-primary-100 flex items-center rounded-xl flex-grow overflow-hidden">
                            <div className="cursor-pointer py-2.5 px-3">
                                <FiSearch className="text-dark opacity-70 text-2xl" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="bg-transparent focus:outline-none text-dark grow py-2.5"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <span className="mt-10 text-secondary">
                        {!searchTerm.length && `Search for messages with ${currentChatUser.name}`}
                    </span>
                </div>

                <div className="flex justify-center h-full flex-col">
                    {searchTerm.length && !searchedMessages.length && (
                        <span className="text-secondary w-full flex justify-center">No messages found</span>
                    )}
                    <div className="flex flex-col w-full h-full">
                        {searchedMessages.map((message) => (
                            <div className="flex cursor-pointer flex-col justify-center hover:bg-primary-300 w-full px-5 border-b-[0.1px] border-secondary py-5">
                                <div className="text-sm text-secondary">{calculateTime(message.createdAt)}</div>
                                <div className="text-green-400">{message.message}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchMessages;

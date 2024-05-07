import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'next-auth/react';

import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import { LuLogOut } from 'react-icons/lu';

import Avatar from '../common/Avatar';
import { showAllContactsPage } from '@/redux/user/userSlice';
import { clearFilteredContacts } from '../../redux/user/userSlice';
import { useLogOutQuery } from '../../redux/features/auth/authApi';

function ChatListHeader() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [logout, setLogout] = useState(false);

    const ref = useRef();

    useEffect(function () {
        function handleClick(e) {
            e.preventDefault();

            console.log();
            if (
                ref.current &&
                !ref.current.contains(e.target) &&
                !e.target.className.baseVal?.includes('bsThreeDotsVertical')
            ) {
                setShowModal(false);
            }
        }

        document.addEventListener('click', handleClick, true);

        return () => document.removeEventListener('click', handleClick, true);
    }, []);

    const {} = useLogOutQuery(undefined, {
        skip: !logout ? true : false,
    });

    const logOutHandler = async () => {
        setLogout(true);
        await signOut();
    };

    const handleAllContactsPage = () => {
        dispatch(showAllContactsPage());
        dispatch(clearFilteredContacts());
    };

    const handleShowModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div className="px-6 py-5 flex justify-between items-center">
            <div className="flex gap-2 items-center">
                <div className="cursor-pointer">
                    <Avatar type="sm" image="/default_avatar.png" />
                </div>
                <p>{user.name}</p>
            </div>

            <div className="flex gap-6">
                <FiEdit
                    className="text-light cursor-pointer text-xl"
                    title="New Chat"
                    onClick={handleAllContactsPage}
                />
                <div className="w-5">
                    <div className="fixed">
                        <BsThreeDotsVertical
                            className="text-light cursor-pointer text-xl bsThreeDotsVertical"
                            title="Menu"
                            onClick={handleShowModal}
                        />
                        {showModal && (
                            <div
                                ref={ref}
                                className={`absolute right-0 top-7 min-w-5 min-h-5 bg-light shadow rounded overflow-hidden z-100
                                }`}
                            >
                                <ul className="select-none text-secondary font-medium ">
                                    <li
                                        className="px-4 py-3 cursor-pointer flex items-center hover:bg-primary-100 ease-in duration-100"
                                        onClick={logOutHandler}
                                    >
                                        <LuLogOut className="mr-2 text-lg " />
                                        <span className="leading-none">Logout</span>
                                    </li>
                                    <li className="px-4 py-3 cursor-pointer flex items-center hover:bg-primary-100 ease-in duration-100">
                                        <LuLogOut className="mr-2 text-lg" />{' '}
                                        <span className="leading-none">Logout</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatListHeader;

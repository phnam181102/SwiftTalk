import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Tippy from '@tippyjs/react/headless';
import { useSelector } from 'react-redux';

import { HiOutlineMail } from 'react-icons/hi';
import { AiOutlineSearch } from 'react-icons/ai';

import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Popper from '../common/Popper';
import { HOST } from '@/utils/ApiRoutes';
import { useFindUserByKeywordQuery, useGetAllUserQuery } from '@/redux/user/userApi';
import Avatar from '../common/Avatar';

const ModalGroup = ({ showModal, setShowModal }) => {
    const [searchResult, setSearchResult] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    console.log({ selectedUsers });
    const [showResult, setShowResult] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [formValue, setFormValue] = useState({
        name: '',
        member: '',
    });
    const { data, refetch } = useFindUserByKeywordQuery();

    // useEffect(() => {
    //     // if (!debounced.trim()) {
    //     //     setSearchResult([]);
    //     //     return;
    //     // }

    //     // setLoadingSearch(true);

    //     fetchApi();
    // });

    const { handleSubmit, register, reset } = useForm({
        // defaultValues: {
        //     name: user.name,
        //     username: user.username,
        //     email: user.email,
        // },
    });

    const onSubmit = async (data) => {
        try {
            const formData = createFormData('image', imageFile);
            formData.append('name', data.name);
            formData.append('username', data.username);
            formData.append('email', data.email);

            await updateProfile({ formData, userId: user.id });

            setImageFile(null);
            setShowModal(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleGroup = (result) => {
        if (!selectedUsers.some((user) => user._id === result._id)) {
            setSelectedUsers([...selectedUsers, result]);
        }
    };

    const handleFocus = () => {
        // refetch();
        setShowResult(true);
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    return (
        <Modal showModal={showModal} setShowModal={setShowModal}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="text-dark w-96 flex flex-col items-start gap-5 p-3 select-none"
            >
                <div className="text-[24px] uppercase">New Group</div>

                <div className="w-full relative flex items-center">
                    <HiOutlineMail
                        className="absolute bottom-[12px] left-3 z-1 cursor-pointer text-gray-500"
                        size={20}
                    />
                    <Input
                        register={register}
                        value={formValue.name}
                        placeholder="Group name"
                        // onChange={handleInputChange}
                        id="name"
                        type="text"
                        required={true}
                    />
                </div>

                <div className="w-full relative flex items-center">
                    <Tippy
                        placement="bottom"
                        // visible={showResult && data?.users.length > 0}
                        interactive
                        render={(attrs) => (
                            <div className="w-[360px]" tabIndex="-1" {...attrs}>
                                <Popper>
                                    <ul className="flex flex-col">
                                        {data?.users.map((result) => {
                                            return (
                                                <li
                                                    onClick={() => handleGroup(result)}
                                                    key={result._id}
                                                    className="flex items-center gap-2 p-2 hover:bg-primary-200 hover:cursor-pointer"
                                                >
                                                    {/* <img src={result.profilePicture} alt="" /> */}
                                                    <Avatar
                                                        type="xsm"
                                                        image={
                                                            result.profilePicture
                                                                ? `${HOST}/${result.profilePicture}`
                                                                : '/default_avatar.png'
                                                        }
                                                    />
                                                    <p>{result.name}</p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Popper>
                            </div>
                        )}
                        onClickOutside={handleHideResult}
                    >
                        <div className="w-full relative flex items-center gap-[8px]">
                            {/* <AiOutlineSearch
                                className="absolute bottom-[12px] left-3 z-1 cursor-pointer text-gray-500"
                                size={20}
                            /> */}
                            <div className="flex items-center">
                                {selectedUsers.map((user) => {
                                    return (
                                        <button
                                            // className={cx('box-item')}
                                            key={user._id}
                                            onClick={() => handleDelete(user)}
                                        >
                                            <p className="min-w-[80px]">{user.name}</p>
                                            {/* <img src={imageSvg.close} alt="" /> */}
                                        </button>
                                    );
                                })}
                            </div>
                            <Input
                                register={register}
                                value={formValue.name}
                                placeholder="Add member"
                                // onChange={handleInputChange}
                                id="member"
                                type="text"
                                required={true}
                                onFocus={handleFocus}
                                className="border-none pl-0 outline-none shadow-none"
                            />
                            {/* {loadingSearch ? (
                                <FaSpinner className={cx('-icon')} />
                            ) : (
                                <AiOutlineSearch className={cx('icon')} />
                            )} */}
                        </div>
                    </Tippy>
                </div>

                <div className="w-full flex justify-end gap-3 mt-4">
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Modal>
    );
};

export default ModalGroup;

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'next-auth/react';

import { FiEdit } from 'react-icons/fi';
import { LuLogOut } from 'react-icons/lu';
import { FaRegUser, FaCameraRotate } from 'react-icons/fa6';
import { HiOutlineMail, HiOutlineAtSymbol } from 'react-icons/hi';

import { HOST } from '@/utils/ApiRoutes';

import { useUpdateInfoMutation, useUpdateAvatarMutation, useUpdateProfileMutation } from '@/redux/user/userApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import Avatar from '../common/Avatar';
import { showAllContactsPage } from '@/redux/user/userSlice';
import { clearFilteredContacts } from '../../redux/user/userSlice';
import { useLogOutQuery } from '../../redux/features/auth/authApi';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import PhotoPicker from '../common/PhotoPicker';
import { createFormData } from '../../utils/createFormData';
import toast from 'react-hot-toast';

function ChatListHeader() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [logout, setLogout] = useState(false);
    const [grabPhoto, setGrabPhoto] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [updateProfile, { isSuccess: updateProfileSuccess, error: updateProfileError }] = useUpdateProfileMutation();
    const [loadUser, setLoadUser] = useState(false);
    const [formValue, setFormValue] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
    });

    const { data: loadedUser } = useLoadUserQuery(user.id, { skip: !loadUser });
    const {} = useLogOutQuery(undefined, {
        skip: !logout ? true : false,
    });

    const { handleSubmit, register, reset } = useForm({
        defaultValues: {
            name: user.name,
            username: user.username,
            email: user.email,
        },
    });

    const logOutHandler = async () => {
        await signOut();
    };

    const handleAllContactsPage = () => {
        dispatch(showAllContactsPage());
        dispatch(clearFilteredContacts());
    };

    const handleShowModal = () => {
        setShowModal(!showModal);
    };

    const photoPickerChange = async (e) => {
        try {
            const file = e.target.files[0];
            setImageFile(file);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValue({ ...formValue, [id]: value });
    };

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

    const handleCloseModal = () => {
        setShowModal(false);
        setImageFile(null);
        setFormValue({
            name: user.name,
            username: user.username,
            email: user.email,
        });
    };

    useEffect(() => {
        if (updateProfileSuccess) {
            setLoadUser(true);
            toast.success('Profile updated successfully');
        }
        if (updateProfileError) {
            toast.error('Update failed. Please try again later');
        }
    }, [updateProfileSuccess]);

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
        <div className="px-6 py-5 flex justify-between items-center">
            <div className="flex gap-2 items-center cursor-pointer" onClick={handleShowModal}>
                <Avatar
                    type="sm"
                    image={user.profilePicture ? `${HOST}/${user.profilePicture}` : '/default_avatar.png'}
                />
                <p className="select-none">{user.name}</p>
            </div>

            <div className="flex gap-6">
                <FiEdit
                    className="text-light cursor-pointer text-xl"
                    title="New Chat"
                    onClick={handleAllContactsPage}
                />
                <LuLogOut className="text-secondary cursor-pointer text-[1.28rem]" onClick={logOutHandler} />
            </div>

            <Modal showModal={showModal} setShowModal={setShowModal}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="text-dark w-96 flex flex-col items-center gap-5 p-3 select-none"
                >
                    <div className="relative">
                        <Avatar
                            type="xl"
                            image={
                                imageFile
                                    ? URL.createObjectURL(imageFile)
                                    : user.profilePicture
                                    ? `${HOST}/${user.profilePicture}`
                                    : '/default_avatar.png'
                            }
                        />
                        <div
                            className="absolute bottom-2 right-2 bg-primary-300 hover:bg-[#5f61ed] text-white rounded-full p-1 border-2 border-white cursor-pointer shadow-md"
                            onClick={() => setGrabPhoto(true)}
                        >
                            <FaCameraRotate size={26} />
                        </div>
                    </div>

                    <div className="w-full flex gap-3 mt-4">
                        <div className="relative flex items-center">
                            <FaRegUser
                                className="absolute bottom-[14px] left-3 z-1 cursor-pointer text-gray-500"
                                size={18}
                            />
                            <Input
                                register={register}
                                value={formValue.name}
                                id="name"
                                type="text"
                                onChange={handleInputChange}
                                required={true}
                            />
                        </div>

                        <div className=" relative flex items-center">
                            <HiOutlineAtSymbol
                                className="absolute bottom-[12px] left-3 z-1 cursor-pointer text-gray-500"
                                size={20}
                            />
                            <Input
                                register={register}
                                value={formValue.username}
                                id="username"
                                type="text"
                                onChange={handleInputChange}
                                required={true}
                            />
                        </div>
                    </div>

                    <div className="w-full relative flex items-center">
                        <HiOutlineMail
                            className="absolute bottom-[12px] left-3 z-1 cursor-pointer text-gray-500"
                            size={20}
                        />
                        <Input
                            register={register}
                            value={formValue.email}
                            onChange={handleInputChange}
                            id="email"
                            type="email"
                            required={true}
                        />
                    </div>

                    <div className="w-full flex justify-end gap-3 mt-4">
                        <Button onClick={handleCloseModal} secondary>
                            Cancel
                        </Button>
                        <Button type="submit">Update</Button>
                    </div>
                </form>
            </Modal>

            {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
        </div>
    );
}

export default ChatListHeader;

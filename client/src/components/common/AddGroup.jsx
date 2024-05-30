import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FaCameraRotate } from 'react-icons/fa6';
import { MdDriveFileRenameOutline } from 'react-icons/md';

import { HOST } from '@/utils/ApiRoutes';
import { useGetAllUserQuery } from '@/redux/user/userApi';
import { convertToFlatObject } from '../../utils/convertToFlatObject';

import Avatar from './Avatar';
import SearchBar from '../Chatlist/SearchBar';
import { setAllContacts } from '../../redux/user/userSlice';
import Input from './Input';
import Button from './Button';
import Modal from './Modal';
import { useForm } from 'react-hook-form';
import PhotoPicker from './PhotoPicker';
import { useCreateGroupMutation, useFetchGroupQuery } from '../../redux/message/messageApi';
import toast from 'react-hot-toast';
import { createFormData } from '../../utils/createFormData';

const AddGroup = ({ showModal, setShowModal }) => {
    const { allContacts: users } = useSelector((state) => state.user);

    const { user } = useSelector((state) => state.auth);
    const { data } = useGetAllUserQuery({ userId: user?.id });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [grabPhoto, setGrabPhoto] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const { refetch: refetchGroup } = useFetchGroupQuery();

    const dispatch = useDispatch();
    const [createGroup, { isSuccess, error }] = useCreateGroupMutation();

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm({});

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUsers([]);
        reset();
    };

    const handleOnChange = (e) => {
        const value = e.target.value;

        let result = [];

        if (value.startsWith('@')) {
            const usernameSearch = value.slice(1).toLowerCase();
            result = users.filter((contact) => contact.username.toLowerCase().startsWith(usernameSearch));
        } else {
            // Ngược lại, tìm kiếm bằng tên
            result = users.filter((contact) => contact.name.toLowerCase().includes(value.toLowerCase()));
        }

        setFilteredContacts(result);
    };

    const onSubmit = async (data) => {
        try {
            const formData = createFormData('image', imageFile);
            formData.append('groupName', data.groupName);
            formData.append('selectedUsers', JSON.stringify(selectedUsers));
            formData.append('admin', user.id);

            await createGroup({ formData });
            refetchGroup();
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setShowModal(false);
            toast.success('Group created successfully');
        }
        if (error) {
            toast.error('Create group failed. Please try again later');
        }
    }, [isSuccess, error]);

    const photoPickerChange = async (e) => {
        try {
            const file = e.target.files[0];
            setImageFile(file);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (data) {
            dispatch(setAllContacts({ allContacts: convertToFlatObject(data.users) }));
        }
    }, [data, dispatch]);

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
        <Modal showModal={showModal} setShowModal={setShowModal}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="text-dark w-96 flex flex-col items-center gap-5 p-3 select-none"
            >
                <p className="text-2xl font-semibold">Start a new group</p>

                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="rounded-full shadow-lg p-2 border border-[#eaebec]">
                            <Avatar
                                type="lg"
                                image={imageFile ? URL.createObjectURL(imageFile) : '/default_group.png'}
                            />
                        </div>

                        <div
                            className="absolute bottom-[-2px] right-[-2px] bg-primary-300 hover:bg-[#5f61ed] text-white rounded-full p-1 border-2 border-white cursor-pointer shadow-md"
                            onClick={() => setGrabPhoto(true)}
                        >
                            <FaCameraRotate size={26} />
                        </div>
                    </div>

                    <div className="w-full relative flex items-center">
                        <MdDriveFileRenameOutline
                            className="absolute bottom-[12px] left-3 z-1 cursor-pointer text-gray-500"
                            size={20}
                        />
                        <Input
                            placeholder="Group Name"
                            id="groupName"
                            register={register}
                            type="text"
                            required={true}
                            errors={errors}
                            autofocus={true}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="w-full">
                    <div className="mx-[-1.5rem]">
                        <SearchBar placeholder="Search contacts" handleOnChange={handleOnChange} />
                    </div>
                    <div className="mt-2 flex flex-col gap-1 overflow-auto min-h-60 max-h-60">
                        {filteredContacts && filteredContacts.length > 0
                            ? filteredContacts?.map((user) => (
                                  <div
                                      key={user.id}
                                      className={`flex gap-3 items-center rounded cursor-pointer active:scale-95 
    								transition-all ease-in-out duration-300
    							${selectedUsers.includes(user.id) ? 'bg-primary-200' : ''}`}
                                      onClick={() => {
                                          if (selectedUsers.includes(user.id)) {
                                              setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                                          } else {
                                              setSelectedUsers([...selectedUsers, user.id]);
                                          }
                                      }}
                                  >
                                      <div className="min-w-fit p-2">
                                          <Avatar
                                              type="sm"
                                              image={
                                                  user?.profilePicture
                                                      ? `${HOST}/${user.profilePicture}`
                                                      : '/default_avatar.png'
                                              }
                                          />
                                      </div>

                                      <div className="w-full">
                                          <div className="flex flex-col items-start justify-between">
                                              <p className="text-md font-medium">
                                                  {user.name || user.email.split('@')[0]}
                                              </p>
                                              <span className="text-gray line-clamp-1 text-sm">{`@${user?.username}`}</span>
                                          </div>
                                      </div>
                                  </div>
                              ))
                            : users?.map((user) => (
                                  <div
                                      key={user.id}
                                      className={`flex gap-3 items-center rounded cursor-pointer active:scale-95 
    								transition-all ease-in-out duration-300
    							${selectedUsers.includes(user.id) ? 'bg-primary-200' : ''}`}
                                      onClick={() => {
                                          if (selectedUsers.includes(user.id)) {
                                              setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                                          } else {
                                              setSelectedUsers([...selectedUsers, user.id]);
                                          }
                                      }}
                                  >
                                      <div className="min-w-fit p-2">
                                          <Avatar
                                              type="md"
                                              image={
                                                  user?.profilePicture
                                                      ? `${HOST}/${user.profilePicture}`
                                                      : '/default_avatar.png'
                                              }
                                          />
                                      </div>

                                      <div className="w-full">
                                          <div className="flex flex-col items-start justify-between">
                                              <p className="text-md font-medium">
                                                  {user.name || user.email.split('@')[0]}
                                              </p>
                                              <span className="text-gray line-clamp-1 text-sm">{`@${user?.username}`}</span>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                    </div>
                </div>

                <div className="w-full flex justify-end gap-3 mt-4">
                    <Button onClick={handleCloseModal} secondary>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={selectedUsers.length < 2}>
                        Create
                    </Button>
                </div>
            </form>

            {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
        </Modal>
    );
};
export default AddGroup;

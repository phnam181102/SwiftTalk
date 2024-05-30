import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useGetInitialContactQuery } from '../../redux/message/messageApi';
import { setOnlineUsers, setUserContacts } from '../../redux/user/userSlice';
import ChatListItem from './ChatLIstItem';

function List() {
    const { user } = useSelector((state) => state.auth);
    const { userContacts, filteredContacts } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { data, error } = useGetInitialContactQuery({ from: user?.id });

    useEffect(() => {
        if (data) {
            dispatch(setUserContacts({ userContacts: data.users }));
            dispatch(setOnlineUsers({ onlineUsers: data.onlineUsers }));
        } else if (error) {
            toast.error(error);
        }
    }, [data]);

    return (
        <div className="bg-transparent flex-auto overflow-auto max-h-full custom-scrollbar mt-6">
            {filteredContacts && filteredContacts.length > 0
                ? filteredContacts.map((contact) => <ChatListItem data={contact} key={contact.id} />)
                : userContacts.map((contact) => <ChatListItem data={contact} key={contact.id} />)}
        </div>
    );
}

export default List;

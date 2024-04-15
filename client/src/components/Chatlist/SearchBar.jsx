import React from 'react';

import { FiSearch } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setContactSearch } from '../../redux/user/userSlice';

function SearchBar({ placeholder }) {
    const dispatch = useDispatch();
    return (
        <div className="flex px-6 items-center">
            <div className="bg-primary-100 flex items-center rounded-xl flex-grow overflow-hidden">
                <div className="cursor-pointer py-2.5 px-3">
                    <FiSearch className="text-dark opacity-70 text-2xl" />
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="bg-transparent focus:outline-none text-dark grow py-2.5"
                    onChange={(e) => dispatch(setContactSearch({ contactSearch: e.target.value }))}
                />
            </div>
        </div>
    );
}

export default SearchBar;

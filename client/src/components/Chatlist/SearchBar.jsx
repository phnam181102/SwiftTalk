import React from 'react';

import { FiSearch } from 'react-icons/fi';

function SearchBar({ placeholder }) {
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
                />
            </div>
        </div>
    );
}

export default SearchBar;

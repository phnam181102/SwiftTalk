'use client';

import clsx from 'clsx';
import React from 'react';

const Button = ({ type, fullWidth, children, onClick, secondary, danger, disabled }) => {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={clsx(
                `flex justify-center text-base rounded-md px-4 py-[10px] text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`,
                disabled && 'opacity-50 cursor-default',
                fullWidth && 'w-full',
                secondary ? 'text-dark border border-dark hover:bg-primary-100' : 'text-whit',
                danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
                !secondary && !danger && 'text-white bg-primary-300 hover:bg-[#5f61ed] ',
            )}
        >
            {children}
        </button>
    );
};

export default Button;

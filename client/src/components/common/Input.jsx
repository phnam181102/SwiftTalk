import React from 'react';
import clsx from 'clsx';

function Input({
    placeholder,
    id,
    type,
    required,
    register,
    errors,
    disabled,
}) {
    return (
        <input
            id={id}
            type={type}
            autoComplete={id}
            placeholder={placeholder}
            disabled={disabled}
            {...register(id, { required })}
            className={clsx(
                'w-full shadow text-black bg-transparent border border-gray h-[50px] pl-10 pr-4 rounded outline-none mt-[8px] font-Poppins',
                errors[id] && 'focus:ring-rose-500',
                disabled && 'opacity-50 cursor-default'
            )}
        />
    );
}

export default Input;

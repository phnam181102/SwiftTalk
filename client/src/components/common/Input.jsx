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
    autofocus = false,
}) {
    return (
        <input
            id={id}
            type={type}
            autoComplete={id}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autofocus}
            {...register(id, { required })}
            className={clsx(
                'w-full shadow text-black bg-transparent border border-[#9ca3af] h-[50px] pl-10 pr-4 rounded outline-none font-Poppins outline-none',
                errors[id] && 'focus:ring-rose-500',
                disabled && 'opacity-50 cursor-default'
            )}
        />
    );
}

export default Input;

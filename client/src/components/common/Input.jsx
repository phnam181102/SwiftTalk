import React from 'react';
import clsx from 'clsx';

function Input({
    placeholder = '',
    onChange,
    value,
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
            defaultValue={value}
            onChange={(e) => onChange && onChange(e)}
            autoFocus={autofocus}
            {...(register ? register(id, { required }) : {})}
            required={required}
            className={clsx(
                'w-full shadow text-black text-base bg-transparent border-2 border-[#6b7280] h-[46px] pl-10 pr-4 rounded outline-none font-Poppins focus:border-2 focus:outline-offset-[-1px] focus:border-primary-300',
                errors?.[id] && 'focus:ring-rose-500',
                disabled && 'opacity-50 cursor-default',
            )}
        />
    );
}

export default Input;

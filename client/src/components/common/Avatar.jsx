import Image from 'next/image';
import React from 'react';

function Avatar({ type, image, setImage }) {
    return (
        <>
            <div className="flex items-center justify-center">
                {type === 'sm' && (
                    <div className="relative h-10 w-10">
                        <Image src={image} alt="Avatar" className="rounded-full" fill sizes="100px" />
                    </div>
                )}
                {type === 'lg' && (
                    <div className="relative h-14 w-14">
                        <Image src={image} alt="Avatar" className="rounded-full" fill sizes="100px" />
                    </div>
                )}
                {type === 'xl' && (
                    <div className="relative h-44 w-44">
                        <Image src={image} alt="Avatar" className="rounded-full" fill sizes="400px" />
                    </div>
                )}
            </div>
        </>
    );
}

export default Avatar;

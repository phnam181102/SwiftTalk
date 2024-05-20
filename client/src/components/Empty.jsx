import Image from 'next/image';
import React from 'react';

function Empty() {
    return (
        <div className="border-conversation-border border-1 w-full bg-white flex flex-col h-[100vh] border-b-4 items-center justify-center border-primary-300">
            <Image src="/swifttalk.gif" alt="swifttalk" width={300} height={300} fixed="true" />
        </div>
    );
}

export default Empty;

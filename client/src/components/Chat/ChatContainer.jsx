import React from 'react';

function ChatContainer() {
    return (
        <div className="h-[80px] w-full flex-grow overflow-auto custom-scrollbar">
            <div className="bg-white"></div>
            <div className="flex w-full">
                <div className="flex flex-col justify-end w-full gap-1 overflow-auto"></div>
            </div>
        </div>
    );
}

export default ChatContainer;

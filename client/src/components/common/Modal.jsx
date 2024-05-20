import React from 'react';

const Modal = ({ showModal, setShowModal, children }) => {
    if (!showModal) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
            onClick={() => setShowModal(false)}
        >
            <div className="bg-white p-4 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PLUSH from '@/assets/images/plush.png';

interface CompleteProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
    isOpen,
    onClose,
}) => {
    const navigate = useNavigate();

    const handleCompleteProfile = () => {
        // Clear the isnew flag from localStorage
        localStorage.removeItem('isnew');
        // Close the modal
        onClose();
        // Navigate to profile editing page
        navigate('/user/mainProfile');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black/40">
            <div className="w-[376px] relative p-10 px-[40px] text-center flex flex-col items-center rounded-[25px] border bg-white shadow-lg">

                <svg className='absolute cursor-pointer right-2 top-2' xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#D9D9D9" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M22 11.105L20.895 10L16 14.9027L11.105 10L10 11.105L14.9027 16L10 20.895L11.105 22L16 17.0973L20.895 22L22 20.895L17.0973 16L22 11.105Z" fill="black" />
                </svg>

                <img src={PLUSH} className='mb-[24px]'/>

                <h3 className="text-[20px] font-semibold">Complete Your Profile</h3>
                <p className="mt-[11px] text-[14px] text-[#575757]">
                There are only a few steps to complete your profile. 
                </p>

                <button
                    onClick={handleCompleteProfile}
                    className="mt-8 flex h-[55px] w-[195px] items-center justify-center rounded-full bg-[#0481EF] p-[10px] text-base text-white"
                >Finish Profile!
                   
                </button>
            </div>
        </div>
    );
};

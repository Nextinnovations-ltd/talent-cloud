import React from 'react';

interface AllJobsActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const AllJobsAction: React.FC<AllJobsActionProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex items-center duration-500 justify-center gap-[24px] cursor-pointer"
    >
      <div className="bg-[#F0F9FF] w-[48px] h-[48px] rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-[16px] duration-1000 group-hover:underline">{label}</h3>
    </button>
  );
};

export default AllJobsAction;

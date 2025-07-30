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
      className="flex items-center justify-center gap-[24px] cursor-pointer"
    >
      <div className="bg-[#F0F9FF] w-[48px] h-[48px] rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3>{label}</h3>
    </button>
  );
};

export default AllJobsAction;

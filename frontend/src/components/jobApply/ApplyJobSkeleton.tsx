import React from "react";

const ApplyJobCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-white border rounded-lg p-[30px] w-[396px] h-[496px] mx-auto">
      <div className="w-[64px] h-[64px] bg-gray-300 rounded mb-6"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-5 bg-gray-200 rounded w-2/4 mb-6"></div>

      <div className="flex gap-2 mb-4">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-20 h-4 bg-gray-200 rounded" />
        <div className="w-16 h-4 bg-gray-200 rounded" />
      </div>

      <div className="flex gap-2 mb-4">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-16 h-4 bg-gray-200 rounded" />
        <div className="w-10 h-4 bg-gray-200 rounded" />
      </div>

      <div className="w-full h-10 bg-gray-200 rounded mb-6"></div>

      <div className="border-t border-gray-200 my-4"></div>

      <div className="flex gap-2 items-center">
        <div className="w-20 h-4 bg-gray-200 rounded" />
        <div className="w-1 h-1 bg-gray-400 rounded-full" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default ApplyJobCardSkeleton;

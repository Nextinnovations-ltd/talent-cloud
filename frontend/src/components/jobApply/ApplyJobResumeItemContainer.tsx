import React from "react";
import { useGetJobSeekerResumeQuery } from "@/services/slices/jobSeekerSlice";
import ApplyJobResumeItem from "./ApplyJobResumeItem";

const ApplyJobResumeItemContainer: React.FC = () => {
  const { data, isLoading, isFetching, isError } = useGetJobSeekerResumeQuery();
  const resumeData = data?.data;


  if (isLoading || isFetching) {
    return (
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-5">
          <div className="h-[51px] w-60 rounded bg-gray-200 animate-pulse" />
          <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }


  if (isError || !resumeData?.resume_url) {
    return (
      <div className="mt-6 p-4 rounded text-sm text-red-500">
        {isError ? "Failed to load resume. Please try again." : "No resume found."}
      </div>
    );
  }


  return (
    <div>
      <ApplyJobResumeItem isLoading={false} ResumeData={resumeData} />
    </div>
  );
};

export default ApplyJobResumeItemContainer;

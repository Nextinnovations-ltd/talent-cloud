import React from 'react';
import { Job } from './ApplyJobCard';
import { ScrollArea } from '../ui/scroll-area';
import { CompanyHeader } from '../common/ApplyJob/CompanyHeader';
import { JobInfoGrid } from '../common/ApplyJob/JobInfoGrid';
import { SkillsSection } from '../common/ApplyJob/SkillsSection';
import { ActionButtons } from '../common/ApplyJob/ActionButtons';
import { CompanyAbout } from '../common/ApplyJob/CompanyAbout';
import AboutJob from '../common/ApplyJob/AboutJob';
import { useGetDetailJobApplyCardQuery } from '@/services/slices/jobApplySlice';
import { X } from 'lucide-react';


type ApplyJobSideBarProps = {
  selectedJob: Job;
  setSelectedJob: (job: Job | null) => void;
};

export const ApplyJobSideBar: React.FC<ApplyJobSideBarProps> = ({
  selectedJob,
  setSelectedJob,
}) => {


  const {
    data: jobDetails,
    isLoading,
    error,
  } = useGetDetailJobApplyCardQuery(selectedJob?.id);



  if (isLoading) {
    return (
      <div className="mt-10 lg:mt-0 lg:w-[60%] rounded sticky top-[190px] h-[100svh] self-start animate-pulse bg-white p-[30px] space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-4 bg-gray-200 rounded col-span-1" />
          <div className="h-4 bg-gray-200 rounded col-span-1" />
          <div className="h-4 bg-gray-200 rounded col-span-1" />
          <div className="h-4 bg-gray-200 rounded col-span-1" />
        </div>
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }
  

  if (error) {
    return <div>Error loading job details</div>;
  }

  return (
    <div className="mt-10 lg:mt-0 lg:w-[60%]  rounded sticky top-[190px] h-[100svh] self-start">
      <ScrollArea className="h-[calc(100vh-220px)] p-[30px]">
        <h3 className="text-[24px] font-semibold">{jobDetails?.title || selectedJob.title}</h3>
        
        <CompanyHeader companyLogo={jobDetails?.company?.image_url || ''} companyName={jobDetails?.company?.name || ''} />
        <JobInfoGrid job={selectedJob} />
        <SkillsSection skills={jobDetails?.skills || []} />
        <ActionButtons />
        
        <p className="mt-2">{jobDetails?.description}</p>
      {
        jobDetails?.company?.id &&   <CompanyAbout job={jobDetails} />
      }

        <AboutJob/>

        <button
          className="mt-4 absolute top-0 right-0  px-4 py-2 bg-white text-blue-600 font-semibold rounded"
          onClick={() => setSelectedJob(null)}
        >
          <X/>
        </button>
      </ScrollArea>
    </div>
  );
};

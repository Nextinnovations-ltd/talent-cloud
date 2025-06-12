import React from 'react';
import { Job } from './ApplyJobCard';
import { ScrollArea } from '../ui/scroll-area';
import { CompanyHeader } from '../common/ApplyJob/CompanyHeader';
import { JobInfoGrid } from '../common/ApplyJob/JobInfoGrid';
import { SkillsSection } from '../common/ApplyJob/SkillsSection';
import { ActionButtons } from '../common/ApplyJob/ActionButtons';
import { CompanyAbout } from '../common/ApplyJob/CompanyAbout';
import AboutJob from '../common/ApplyJob/AboutJob';

type ApplyJobSideBarProps = {
  selectedJob: Job;
  setSelectedJob: (job: Job | null) => void;
};

export const ApplyJobSideBar: React.FC<ApplyJobSideBarProps> = ({
  selectedJob,
  setSelectedJob,
}) => {
  return (
    <div className="mt-10 lg:mt-0 lg:w-[60%] border-[1px]  rounded sticky top-[100px] h-[100svh] self-start">
      <ScrollArea className="h-[calc(100vh-120px)] p-[30px]">
        <h3 className="text-[24px] font-semibold">{selectedJob.title}</h3>
        
        <CompanyHeader companyName={selectedJob.companyName} />
        <JobInfoGrid job={selectedJob} />
        <SkillsSection skills={selectedJob.skills} />
        <ActionButtons />
        
        <p className="mt-2">{selectedJob.description}</p>
        <CompanyAbout job={selectedJob} />

        <AboutJob/>

        <button
          className="mt-4 px-4 py-2 bg-white text-blue-600 font-semibold rounded"
          onClick={() => setSelectedJob(null)}
        >
          Close
        </button>
      </ScrollArea>
    </div>
  );
};

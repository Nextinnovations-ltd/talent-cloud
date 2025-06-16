import React, { useEffect, useState } from "react";
import ApplyJobCard, { Job } from "@/components/jobApply/ApplyJobCard";
import { ApplyJobSideBar } from "@/components/jobApply/ApplyJobSideBar";
import ApplyJobCardSkeleton from "@/components/jobApply/ApplyJobSkeleton";
import { PostUploadedCombo } from "@/components/jobApply/PostUploadedCombo";
import ApplyJobFilters from "@/components/jobApply/ApplyJobFilters";
import ApplyJobHero from "@/components/jobApply/ApplyJobHero";
import { useGetJobApplyCardQuery } from "@/services/slices/jobApplySlice";
import { data } from "react-router-dom";

export const Home: React.FC = () => {
  const { data: jobs, isLoading } = useGetJobApplyCardQuery();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(()=>{
    console.log(data)
  },[isLoading])

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  return (
    <div>
      <ApplyJobFilters />
      <ApplyJobHero />
      <div className="container mx-auto mb-[50px] items-center p-4 flex justify-between">
        <h3>{jobs?.length || 0} job opportunities waiting.</h3>
        <PostUploadedCombo />
      </div>
      <div className="flex gap-[40px] pb-[200px] container mx-auto flex-col lg:flex-row">
        <div
          className={`grid mx-auto justify-center items-center transition-all gap-[60px] duration-300 ${
            selectedJob
              ? "grid-cols-1" // center in 1-column view
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ApplyJobCardSkeleton key={index} />
              ))
            : jobs?.map((job) => (
                <ApplyJobCard
                  key={job.id}
                  job={job}
                  onClick={handleJobClick}
                  isSelected={selectedJob?.id === job.id}
                />
              ))}
        </div>
        {selectedJob && (
          <ApplyJobSideBar
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
          />
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import ApplyJobCard, { Job } from "@/components/jobApply/ApplyJobCard";
import { ApplyJobSideBar } from "@/components/jobApply/ApplyJobSideBar";
import ApplyJobCardSkeleton from "@/components/jobApply/ApplyJobSkeleton";
import { PostUploadedCombo } from "@/components/jobApply/PostUploadedCombo";
import ApplyJobFilters from "@/components/jobApply/ApplyJobFilters";
import ApplyJobHero from "@/components/jobApply/ApplyJobHero";
import { useGetJobApplyCardQuery } from "@/services/slices/jobApplySlice";
import { useSearchParams } from "react-router-dom";

export const Home: React.FC = () => {
  const [page, setPage] = useState(1);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    job_type: searchParams.get('job_type') || '',
    work_type: searchParams.get('work_type') || '',
    project_duration: searchParams.get('project_duration') || '',
    salary_rate:searchParams.get('salary_rate') || ''
  });

  const { data, isLoading, isFetching } = useGetJobApplyCardQuery({ 
    page,
    ...filters
  });

  useEffect(() => {
    if (data?.data.results) {
      if (page === 1) {
        setAllJobs(data.data.results);
      } else {
        setAllJobs(prev => {
          const existingIds = new Set(prev.map(job => job.id));
          const newJobs = data.data.results.filter(job => !existingIds.has(job.id));
          return [...prev, ...newJobs];
        });
      }
      setIsLoadingMore(false);
    }
  }, [data, page]);

  // Select job if jobId is present in URL
  useEffect(() => {
    const jobIdParam = searchParams.get('jobId');
    if (jobIdParam && allJobs.length > 0) {
      const jobId = Number(jobIdParam);
      const foundJob = allJobs.find(job => job.id === jobId);
      if (foundJob) {
        setSelectedJob(foundJob);
      }
    }
  }, [searchParams, allJobs]);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPage(1); // Reset page when filters change
    setSelectedJob(null); // Clear selected job when filters change

    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      >= document.documentElement.offsetHeight - 200
    ) {
      if (data?.data.next && !isFetching && !isLoadingMore) {
        setIsLoadingMore(true);
        setPage(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data?.data.next, isFetching, isLoadingMore]);

  return (
    <div>
      <ApplyJobFilters onFiltersChange={handleFiltersChange} />
      <ApplyJobHero />
      <div className="container mx-auto mb-[50px] items-center p-4 flex justify-between">
        <h3>{data?.data.count || 0} job opportunities waiting.</h3>
        <PostUploadedCombo />
      </div>
      <div className={`flex gap-[40px] pb-[200px] container mx-auto flex-col lg:flex-row`}>
        <div
          className={`grid mx-auto justify-center items-center transition-all gap-[30px] duration-300 ${
            selectedJob
              ? "grid-cols-1 pb-[400px]"
              : "grid-cols-1 sm:grid-cols-2 pb-0 lg:grid-cols-3"
          }`}
        >
          {isLoading && page === 1
            ? Array.from({ length: 6 }).map((_, index) => (
                <ApplyJobCardSkeleton key={index} />
              ))
            : allJobs.map((job) => (
                <ApplyJobCard
                  key={job.id}
                  job={job}
                  onClick={handleJobClick}
                  isSelected={selectedJob?.id === job.id}
                />
              ))}
          {isLoadingMore && (
            <div className="col-span-full flex justify-center gap-[60px] mt-4 animate-fade-in">
              {Array.from({ length: 3 }).map((_, index) => (
                <ApplyJobCardSkeleton key={`loading-${index}`} />
              ))}
            </div>
          )}
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

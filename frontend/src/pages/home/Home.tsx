import React, { useState, useEffect } from "react";
import ApplyJobCard, { Job } from "@/components/jobApply/ApplyJobCard";
import { ApplyJobSideBar } from "@/components/jobApply/ApplyJobSideBar";
import ApplyJobCardSkeleton from "@/components/jobApply/ApplyJobSkeleton";
import { PostUploadedCombo } from "@/components/jobApply/PostUploadedCombo";
import ApplyJobFilters from "@/components/jobApply/ApplyJobFilters";
import ApplyJobHero from "@/components/jobApply/ApplyJobHero";
import { useGetJobApplyCardQuery } from "@/services/slices/jobApplySlice";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useJobSearchStore from "@/state/zustand/job-search";
import CommonError from "@/components/CommonError/CommonError";

export const Home: React.FC = () => {
  const [page, setPage] = useState(1);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery } = useJobSearchStore();
  const [showHero, setShowHero] = useState(true);

  const [filters, setFilters] = useState({
    job_type: searchParams.get('job_type') || '',
    work_type: searchParams.get('work_type') || '',
    project_duration: searchParams.get('project_duration') || '',
    salary_rate:searchParams.get('salary_rate') || '',
  });

  const { data, isLoading, isFetching,refetch } = useGetJobApplyCardQuery({ 
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

  // Update search filter when global searchQuery changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
    // Update URL with new search
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
      // Remove jobId from URL when search query appears to prevent job re-selection
      params.delete('jobId');
    } else {
      params.delete('search');
    }
    setSearchParams(params);
    setPage(1);
    setSelectedJob(null);
  }, [searchQuery]);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    refetch();
    
    // Update URL with jobId
    const params = new URLSearchParams(searchParams.toString());
    params.set('jobId', job.id.toString());
    setSearchParams(params);
  };

  useEffect(()=>{
    console.log("-------")
    console.log(selectedJob)
    console.log("-------")

  },[selectedJob])


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
      {/* <div className="relative">
        <div className="absolute top-[-30px] right-4 z-10">
          <span
            className="cursor-pointer p-2 rounded-full bg-white shadow-lg hover:scale-110 hover:bg-blue-100 transition flex items-center justify-center w-10 h-10"
            onClick={() => setShowHero((prev) => !prev)}
            aria-label={showHero ? 'Hide Hero' : 'Show Hero'}
            title={showHero ? 'Hide Hero' : 'Show Hero'}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowHero(prev => !prev); }}
            role="button"
          >
            {showHero ? (
              // Eye Open Icon
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#2563eb" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
            ) : (
              // Eye Off Icon
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#2563eb" strokeWidth="2" d="M17.94 17.94C16.11 19.25 14.13 20 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.06M9.53 9.53A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .47-.11.91-.29 1.29"/><path stroke="#2563eb" strokeWidth="2" d="m1 1 22 22"/></svg>
            )}
          </span>
        </div>
         <AnimatePresence>
          {showHero && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <ApplyJobHero />
            </motion.div>
          )}
        </AnimatePresence> 
      </div> */}
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
            : allJobs.length === 0 && !isLoading ? (
                <CommonError/>
              ) : (
                allJobs.map((job) => (
                  <ApplyJobCard
                    key={job.id}
                    job={job}
                    onClick={handleJobClick}
                    isSelected={selectedJob?.id === job.id}
                  />
                ))
              )}
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

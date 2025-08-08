import JobCard from "@/components/superAdmin/JobCard";
import SortsButtons from "./SortsButtons";
import { useGetNIAllJobsByAdminQuery } from "@/services/slices/adminSlice";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageInitialLoading } from "@/components/common/PageInitialLoading";
import { AllJobsMainTabs } from "./AllJobsMainTabs";
import Pagination from "@/components/common/Pagination";
import JobCardSkeleton from "./JobCardSkeletion";

const AllJobs = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("-created_at");
  const { data, isLoading, isFetching, error } = useGetNIAllJobsByAdminQuery(
    { page, ordering: sortBy },
    { refetchOnMountOrArgChange: true }
  );

  // Reset to page 1 when sorting changes
  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  const handleNextPage = () => {
    if (data?.data?.next) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (data?.data?.previous) {
      setPage(page - 1);
    }
  };

  return (
    <div className="py-[44px] w-[calc(100svw-300px)]">
      <h3 className="text-[24px] font-semibold">Welcome Back!</h3>
      <p className="text-[#575757] mb-[77px]">Here What happening with yours jobs</p>

      <div className="flex items-center mb-[80px] justify-between">
        <AllJobsMainTabs 
          title="Jobs" 
          myJobTotal={data?.data.count || 0} 
          isLoading={isLoading}
        />
          <div className="flex items-center justify-center pr-[24px] gap-4">
            <SortsButtons
              title="Applicants"
              field="applicant_count"
              currentSort={sortBy}
              onToggle={setSortBy}
            />
            <SortsButtons
              title="Views"
              field="view_count"
              currentSort={sortBy}
              onToggle={setSortBy}
            />
            <SortsButtons
              title="Date"
              field="created_at"
              currentSort={sortBy}
              onToggle={setSortBy}
            />
          </div>
      </div>

      {isLoading ? (
        <div className="py-[44px] h-[50svh] flex justify-center items-center">
          <PageInitialLoading />
        </div>
      ) : error ? (
        <div className="py-[44px] flex justify-center items-center">
          Error loading jobs
        </div>
      ) : !data?.data?.results?.length ? (
        <div className="py-[44px] flex flex-col justify-center items-center">
          <div className="mb-4">No jobs found</div>
          <Button onClick={() => setPage(1)}>Reset to first page</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 pr-[24px] justify-center gap-[30px]">
            {isFetching ? (
               <>
               <JobCardSkeleton />
               <JobCardSkeleton />
               <JobCardSkeleton />
               <JobCardSkeleton />
               <JobCardSkeleton />
               <JobCardSkeleton />

               {/* Add as many skeletons as you want to show during loading */}
             </>
            ) : (
              data.data.results.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  specialization={job.specialization_name}
                  status={job.job_post_status}
                  applicants={job.applicant_count}
                  views={job.view_count}
                  postedDate={job.posted_date}
                  deadlineDate={job.deadline_date}
                />
              ))
            )}
          </div>

          {data?.data?.results?.length > 0 && (
            <Pagination
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
              page={page}
              totalPages={Math.ceil(data.data.count / 15)}
              isPreviousDisabled={!data?.data?.previous || isFetching}
              isNextDisabled={!data?.data?.next || isFetching}
              isFetching={isFetching}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AllJobs;
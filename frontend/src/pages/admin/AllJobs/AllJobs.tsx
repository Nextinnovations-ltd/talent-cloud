import JobCard from "@/components/superAdmin/JobCard";
import AllJobsTabs from "./AllJobsTabs";
import SortsButtons from "./SortsButtons";
import { useGetNIAllJobsByAdminQuery } from "@/services/slices/adminSlice";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";


const AllJobs = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetNIAllJobsByAdminQuery(page);

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


  if (isLoading || isFetching) {
    return <div className="py-[44px] h-[100svh] w-[calc(100svw-300px)] flex justify-center items-center"><LoadingSpinner/></div>;
  }

  if (!data?.data?.results?.length) {
    return <div className="py-[44px] w-[calc(100svw-300px)] flex justify-center items-center">No jobs found</div>;
  }

  return (
    <div className="py-[44px] w-[calc(100svw-300px)]">
      <h3 className="text-[24px] font-semibold">Welcome Back!</h3>
      <p className="text-[#575757] mb-[77px]">Here What happening with yours jobs</p>

      <div className="flex items-center mb-[80px] justify-between">
        <AllJobsTabs myJobTotal={data?.data.count || 0}  />
        <div className="flex items-center justify-center pr-[24px] gap-4">
          <SortsButtons title="Applicants" />
          <SortsButtons title="Views" />
          <SortsButtons title="Date" />
        </div>
      </div>

      <div className="grid grid-cols-3 pr-[24px] justify-center gap-[30px]">
        {data.data.results.map((job) => (
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
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8 gap-4">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={!data?.data?.previous || isFetching}
          className="disabled:opacity-50"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {page} of {Math.ceil(data.data.count / 15)} {/* Assuming 10 items per page */}
        </span>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={!data?.data?.next || isFetching}
          className="disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AllJobs;
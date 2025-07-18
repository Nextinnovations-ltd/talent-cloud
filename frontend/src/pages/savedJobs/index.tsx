import BackButton from "@/components/common/BackButton";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import JobCardGrid from "@/components/jobApply/JobCardGrid";
import { useGetOrganizationDetailQuery } from "@/services/slices/organizationSlice";
import { Job } from "@/types/job-apply";
import { motion } from "framer-motion";

export const SavedJobs = () => {

  const { data: organization, isLoading, isError } = useGetOrganizationDetailQuery('next-innovations');

  const jobs = organization?.job_posts ?? [];

  const handleJobClick = (job: Job) => {

    console.log(job)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto  h-[80svh] py-[50px] flex justify-center items-center">
       <LoadingSpinner/>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-[50px] flex justify-center items-center">
        <span className="text-red-500">Failed to load organization details.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto  py-[50px] ">
      <div className="flex mb-[100px] items-center  gap-[48px]">
      <BackButton/><h3 className="text-[24px] font-semibold">Saved Jobs</h3>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <JobCardGrid jobs={jobs} onJobClick={handleJobClick} />
      </motion.div>
    </div>
  )
}


export default SavedJobs;
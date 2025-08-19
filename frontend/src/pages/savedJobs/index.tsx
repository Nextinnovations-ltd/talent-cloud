import BackButton from "@/components/common/BackButton";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import CommonError from "@/components/CommonError/CommonError";
import JobCardGrid from "@/components/jobApply/JobCardGrid";
import { useGetJobSeekerBookMarkedJobsQuery } from "@/services/slices/jobApplySlice";
import { Job } from "@/types/job-apply";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EMPTY from '@/assets/emptyBookmark.png';

export const SavedJobs = () => {

  const { data: savedJobs, isLoading, isError } = useGetJobSeekerBookMarkedJobsQuery();
  const navigate = useNavigate();

  const jobs = savedJobs?.data?.flatMap(app => app.job_post) ?? [];

  const handleJobClick = (job: Job) => {
   console.log(job)
  }

  const handleAction = ()=>{
    navigate(`/`);
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
    <div className="container  mx-auto 2xl:px-[100px]  py-[50px] ">
       <div className={clsx('flex items-center  gap-[48px]',jobs.length === 0 ? 'mb-[40px]' : 'mb-[100px]')}>
      <BackButton handleBack={handleAction}/><h3 className="text-[24px] font-semibold">Saved Jobs</h3>
      </div>
      {
      (jobs.length === 0) ? <CommonError image={EMPTY} title="No Saved Jobs" description="Browse and save the ones you like." action handleAction={handleAction} actionText="Saved jobs" /> :  <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <JobCardGrid jobs={jobs} onJobClick={handleJobClick} />
      </motion.div>
     }
    </div>
  )
}


export default SavedJobs;
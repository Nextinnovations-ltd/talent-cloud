import React from "react";
import ApplyJobCard, { Job } from "./ApplyJobCard";
import { Link } from "react-router-dom";

interface JobCardGridProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
  selectedJobId?: number | null;
}

const JobCardGrid: React.FC<JobCardGridProps> = ({ jobs, onJobClick, selectedJobId }) => (
  <div className="grid mx-auto justify-center items-center transition-all gap-[30px] duration-300 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    {jobs.map((job) => (
     <Link to={job?.is_expired ? `/user/expiredJobDetails/${job.id}`:`/?jobId=${job.id}`}>
      <ApplyJobCard
        key={job.id}
        job={job}
        onClick={() => onJobClick(job)}
        isSelected={selectedJobId === job.id}
      />
     </Link>
    ))}
  </div>
);

export default JobCardGrid; 
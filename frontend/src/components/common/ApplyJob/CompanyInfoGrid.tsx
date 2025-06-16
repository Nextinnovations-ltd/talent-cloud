import { Job } from '@/components/jobApply/ApplyJobCard';
import React from 'react'
import InfoItem from './InfoItem';
import BUILDING from '@/assets/building.svg'
import EMPLOYEE from '@/assets/users.svg'
import CALENDAR from '@/assets/calendar.svg'
import SHIELD from '@/assets/shield-check.svg'

interface CompanyInfoGridProps {
    job: Job;
  }
  
export const CompanyInfoGrid: React.FC<CompanyInfoGridProps> = ({ job }) => {
  return (
    <div className='grid gap-[14px] mb-[40px] grid-cols-2'>
    <InfoItem icon={BUILDING} text={job.created_at} alt="Time" />
    <InfoItem icon={EMPLOYEE} text={job.location} alt="Location" />
    <InfoItem icon={CALENDAR} text={job.work_type} alt="Schedule" />
    <InfoItem icon={SHIELD} text={job.job_type} alt="Job Type" />

  </div>
  )
}

import { Job } from '@/components/jobApply/ApplyJobCard';
import React from 'react'
import InfoItem from './InfoItem';
import BUILDING from '@/assets/building.svg'
import EMPLOYEE from '@/assets/users.svg'
import CALENDAR from '@/assets/calendar.svg'
import SHIELD from '@/assets/shield-check.svg'

interface CompanyInfoGrid {
    job: Job;
  }
  
export const CompanyInfoGrid: React.FC<CompanyInfoGrid> = ({ job }) => {
  return (
    <div className='grid gap-[14px] mb-[40px] grid-cols-2'>
    <InfoItem icon={BUILDING} text={job.created_at} alt="Time" />
    <InfoItem icon={EMPLOYEE} text="Any Country" alt="Location" />
    <InfoItem icon={CALENDAR} text="Flexible Schedule" alt="Schedule" />
    <InfoItem icon={SHIELD} text={job.jobType} alt="Job Type" />

  </div>
  )
}

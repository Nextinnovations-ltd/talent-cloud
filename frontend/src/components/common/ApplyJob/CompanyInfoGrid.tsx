import React from 'react'
import InfoItem from './InfoItem';
import BUILDING from '@/assets/building.svg'
import EMPLOYEE from '@/assets/users.svg'
import CALENDAR from '@/assets/calendar.svg'
import SHIELD from '@/assets/shield-check.svg'
import { JOBDETAILTYPES } from '@/types/job-apply';

interface CompanyInfoGridProps {
    job: JOBDETAILTYPES;
  }
  
export const CompanyInfoGrid: React.FC<CompanyInfoGridProps> = ({ job }) => {
  return (
    <div className='grid gap-[14px] mb-[40px] grid-cols-2'>
    <InfoItem icon={BUILDING} text={job.company?.founded_date || 'N/A'} alt="Time" />
    <InfoItem icon={EMPLOYEE} text={job.company?.size || 'N/A'} alt="size" />
    <InfoItem icon={CALENDAR} text={job.company?.industry || 'N/A'} alt="Schedule" />
    <InfoItem icon={SHIELD} text={job.company?.is_verified ? "Verified" : "Not Verified"} alt="Job Type" />
  </div>
  )
}

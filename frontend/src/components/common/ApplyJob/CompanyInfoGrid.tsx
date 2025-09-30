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


  console.log("kdkdkdkd")
  console.log(job)
  console.log("kdkdkdkd")


  return (
   <div className='flex gap-[32px]'>
   <div className='grid gap-[5px] mt-[16px] grid-cols-2'>
   {
  job.company.company_image_urls?.map((e, index) => (
    <div key={index} className="relative">
      {/* Skeleton */}
      <div className="absolute inset-0  bg-gray-300 animate-pulse rounded-[4px]" />

      {/* Real image */}
      <img
        width={150}
        className="rounded-[4px] relative bg-gray-200 z-10"
        src={`${e}?t=${new Date().getTime()}`} // cache-busting
        alt={`Company image ${index}`}
        onLoad={(ev) => {
          (ev.target as HTMLImageElement).previousElementSibling?.classList.add("hidden");
        }}
        onError={(ev) => {
          (ev.target as HTMLImageElement).previousElementSibling?.classList.add("hidden");
        }}
      />
    </div>
  ))
}


    </div>
     <div className='grid gap-[14px] w-full mt-[16px] grid-cols-2'>
    <InfoItem icon={BUILDING} text={job.company?.industry || 'N/A'} alt="Time" />
    <InfoItem icon={EMPLOYEE} text={job.company?.size || 'N/A'} alt="size" />
    <InfoItem icon={CALENDAR} text={job.company?.founded_date || 'N/A'} alt="Schedule" />
    <InfoItem icon={SHIELD} text={job.company?.is_verified ? "Verified" : "Not Verified"} alt="Job Type" />
  </div>
   </div>
  )
}

import React from 'react'
import arrowRight from '../../../assets/Employee/arrow-right.svg'
import GoogleIcon from '../../../assets/Employee/Google_Logo.svg'
import Linkedin from '../../../assets/Employee/Linkedin_logo.svg'
import Netflix from '../../../assets/Employee/Netflix.svg'
import NewTag from '../../../assets/Employee/New.svg'
import BookMark from '../../../assets/Employee/Bookmark Tooltip.svg'
import BookMarkActive from '../../../assets/Employee/Bookmark Active.svg'
import dollarSign from '../../../assets/Employee/dollar_16026501 1.svg'
import userSign from '../../../assets/Employee/users_7263413 1.svg'
import fragSign from '../../../assets/Employee/users_7263413 2.svg'
import { useGetRecentJobListsQuery } from '@/services/slices/landingPageSlice'
import ApplyJobCard from '@/components/jobApply/ApplyJobCard'
import { useNavigate } from 'react-router-dom'


const JobMatch = () => {


  const {data} = useGetRecentJobListsQuery();
  const navigate = useNavigate();

  const recentJobs = data?.data.map((job) => ({
    ...job,
    is_new: true,
  })) ?? [];

  return (
      <div className='w-full bg-[#EEF4FF] pt-[74px] pb-[74px] flex flex-col gap-[69px]'>
          <h1 className='text-black text-[40px] font-[600] text-center mb-[48px]'>
          FIND YOUR JOB MATCH
          </h1>

        <div className="max-w-[1240px] mx-auto grid grid-cols-3 gap-6">
        {
            recentJobs?.map((job) => (
                <ApplyJobCard
                  key={job.id}
                  job={job}
                  onClick={()=>{}}
                  isSelected={false}
                />
              ))
          }
        </div>        
          <div onClick={()=>{navigate('/auth/login')}} className="flex cursor-pointer gap-[17px] justify-center items-center w-[345px] h-[72px] rounded-[28px] border border-[#0A66C2] mx-auto">
          <a href="" className=''>See all jobs post</a>
          <img src={arrowRight} alt="" />
          </div>
      </div>
  )
}

export default JobMatch
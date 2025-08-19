/* eslint-disable @typescript-eslint/no-explicit-any */
import arrowRight from '../../../assets/Employee/arrow-right.svg'
import { useGetRecentJobListsQuery } from '@/services/slices/landingPageSlice'
import ApplyJobCard from '@/components/jobApply/ApplyJobCard'
import { useNavigate } from 'react-router-dom'


const JobMatch = () => {


  const { data } = useGetRecentJobListsQuery();
  const navigate = useNavigate();

  const recentJobs = data?.data.map((job: any) => ({
    ...job,
    is_new: true,
  })) ?? [];

  return (
    <div id='find-jobs' className='w-full bg-[#EEF4FF] pt-[74px] pb-[74px] flex flex-col gap-[69px]'>
      <h1 className='text-black text-[40px] font-[600] text-center mb-[48px]'>
        FIND YOUR JOB MATCH
      </h1>

      <div className="max-w-[1240px] mx-auto  flex flex-col justify-center items-center  md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          recentJobs?.map((job: any) => (
            <ApplyJobCard
              key={job.id}
              job={job}
              onClick={() => {
                navigate(`/auth/login`)
              }}
              isSelected={false}
            />
          ))
        }
      </div>
      <div onClick={() => { navigate('/auth/login') }} className="flex cursor-pointer gap-[17px] justify-center items-center w-[345px] h-[72px] rounded-[28px] border border-[#0A66C2] mx-auto">
        <a href="" className=''>See all jobs post</a>
        <img src={arrowRight} alt="" />
      </div>
    </div>
  )
}

export default JobMatch
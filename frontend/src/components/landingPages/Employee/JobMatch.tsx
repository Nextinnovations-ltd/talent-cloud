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
      <button
        onClick={() => navigate('/auth/login')}
        className="group flex items-center justify-center gap-[12px] w-[345px] h-[72px] 
                   rounded-[28px] border border-[#0A66C2] text-[#000] font-medium 
                   transition-all duration-300 hover:bg-[#0A66C2] hover:text-white mx-auto"
      >
        <span>See all jobs post</span>
        <img 
          src={arrowRight} 
          alt="arrow" 
          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:invert"
        />
      </button>


    </div>
  )
}

export default JobMatch
/* eslint-disable @typescript-eslint/no-explicit-any */
import arrowRight from '../../../assets/Employee/arrow-right.svg'
import { useGetRecentJobListsQuery } from '@/services/slices/landingPageSlice'
import ApplyJobCard from '@/components/jobApply/ApplyJobCard'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";

const JobMatch = () => {


  const { data } = useGetRecentJobListsQuery();
  const navigate = useNavigate();

  const recentJobs = data?.data.map((job: any) => ({
    ...job,
    is_new: true,
  })) ?? [];

  return (
    <div id='find-jobs' className='w-full bg-[#EEF4FF] pt-[48x] md:pt-[74px] pb-[48px] md:pb-[74px] flex flex-col gap-[69px]'>
      <motion.h1 className='text-black text-[20px] md:text-[40px] font-[600] text-center mb-6 md:mb-[48px]' initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}>
        FIND YOUR JOB MATCH
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }} className="max-w-[1240px] mx-auto  flex flex-col justify-center items-center  md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </motion.div>
      <button
        onClick={() => navigate('/auth/login')}
        className="group flex items-center justify-center gap-[17px]  w-[233px] md:w-[345px] h-[66px] md:h-[72px] 
                   rounded-[28px] border border-[#0389FF] text-[#000] font-medium 
                   transition-all duration-300 hover:bg-[#0389FF] hover:text-white mx-auto"
      >
        <span>See all jobs post</span>
        <img  
          src={arrowRight} 
          alt="arrow" 
          className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:invert"
        />
      </button>


    </div>
  )
}

export default JobMatch
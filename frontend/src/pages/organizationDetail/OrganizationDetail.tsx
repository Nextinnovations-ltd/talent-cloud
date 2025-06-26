import React, { useState, useEffect } from "react";
import Slider from "@/components/common/Slider";
import LINKEDIN from '@/assets/skill-icons_linkedin.png';
import INSTAGRAM from '@/assets/skill-icons_instagram.png';
import FACEBOOK from '@/assets/logos_facebook.png';
import WORLD from '@/assets/clarity_world-line.png'
import InfoItem from "@/components/common/ApplyJob/InfoItem";
import LOCATION from '@/assets/location.svg';

import BUILDING from '@/assets/svgs/carbon_building.svg';
import USERS from '@/assets/svgs/users.svg';
import PHONE from '@/assets/svgs/phone.svg';
import CALENDAR from '@/assets/calendar.svg';
import SHIELD from '@/assets/shield-check.svg';
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import JobCardGrid from "@/components/jobApply/JobCardGrid";
import { useGetJobApplyCardQuery } from "@/services/slices/jobApplySlice";
import { Job } from "@/components/jobApply/ApplyJobCard";


const OrganizationDetail = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Fetch all jobs for now; replace with company filter if available
  const { data } = useGetJobApplyCardQuery({ page: 1 });
  const jobs = data?.data?.results || [];

  const handleJobClick = (job: Job) => {
    navigate(`/?jobId=${job.id}`);
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <div className="w-full pt-[200px] h-[400px] bg-[url('https://en.idei.club/uploads/posts/2023-03/1679223637_en-idei-club-p-office-background-image-dizain-krasivo-1.jpg')] bg-cover bg-center">
          <div className="bg-white container flex gap-[60px] rounded-lg px-[50px] items-center p-[20px] mx-auto w-full drop-shadow-md h-[400px] ">
            <div>
              <Skeleton className="w-[160px] h-[160px] rounded-full" />
              <div className="flex gap-[32px] mt-[48px]">
                {[1,2,3].map((_,i) => (
                  <div key={i} className="text-center flex flex-col items-center justify-center">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-3 w-12 mt-1" />
                  </div>
                ))}
              </div>
              <div className="flex gap-[5px] mt-[30px] items-center">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex-1">
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-4" />
              <div className="grid gap-[30px] my-[40px] grid-cols-3">
                {[...Array(6)].map((_,i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </div>
          </div>
        </div>
        <div className="mt-[280px] container rounded-lg mx-auto">
          <div>
            <Skeleton className="h-7 w-1/4 mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <div className="mt-[50px]">
            <Skeleton className="h-7 w-1/4 mb-2" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="mt-[50px] pb-[100px]">
            <Skeleton className="h-7 w-1/4 mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div 
        className="w-full pt-[200px] h-[400px] bg-[url('https://en.idei.club/uploads/posts/2023-03/1679223637_en-idei-club-p-office-background-image-dizain-krasivo-1.jpg')] bg-cover bg-center"
      >
        <div className="bg-white container flex gap-[60px] rounded-lg px-[50px] items-center p-[20px] mx-auto w-full drop-shadow-md h-[400px] ">
          <div className="">
          <img src="https://media.licdn.com/dms/image/v2/C560BAQGcfqdw_vsCWw/company-logo_200_200/company-logo_200_200/0/1661480956151?e=2147483647&v=beta&t=MLtNzIWNO57HMZUnZQHT4YOXvLabRVJaX2AE_iqu6tc" width={160} className="rounded-full"/>

          <div className="flex gap-[32px] mt-[48px]">

            <div className="text-center flex flex-col items-center justify-center">
            <img src={LINKEDIN} width={32}/>
            <p className="text-[12px] mt-[5px]">LinkedIn</p>
            </div>
            <div className="text-center flex flex-col items-center justify-center">
            <img src={INSTAGRAM} width={32}/>
            <p className="text-[12px] mt-[5px]">Instagram</p>
            </div>
            <div className="text-center flex flex-col items-center justify-center">
            <img src={FACEBOOK} width={32}/>
            <p className="text-[12px] mt-[5px]">Facebook</p>
            </div>
            
          </div>

           <div className="flex gap-[5px] mt-[30px]">
            <img width={24} src={WORLD}/>
            <p className="underline text-[#F24539]">Next Innovation.com</p>
           </div>

          </div>
          <div>
            <h3 className="text-[32px] mb-[4px]">Next Innovation</h3>
            <p>Web & Media</p>
            <div className='grid gap-[30px] my-[40px] grid-cols-3'>
            <InfoItem icon={BUILDING} text={'Technology'} alt="Time" />
            <InfoItem icon={USERS} text={'11-12 Employee'} alt="Time" />
            <InfoItem icon={PHONE} text={'+95 9123456789'} alt="Time" />
            <InfoItem icon={CALENDAR} text={'May 15, 2010'} alt="Time" />
            <InfoItem icon={SHIELD} text={'Verified '} alt="Time" />
            <InfoItem icon={LOCATION} text={'Room No (602, Gandamar Residence, Gandamar Road, Yangon'} alt="Time" />

            </div>
            <p className="text-[#6B6B6B]">We Provide Web Development, Digital Marketing, UI/UX Service, and Video Production. One-stop digital service company from Japan.</p>
          </div>
        </div>
      </div>
      <div className="mt-[280px] container rounded-lg mx-auto">
        <div>
          <h3 className="text-[26px] font-semibold">About Company</h3>
          <p className="mt-[20px] text-[#6B6B6B] text-[18px]">We are web development and digital marketing company. Our technology and knowledge are Japan. we can think about your success of the your business.please contact us if you want to get success of the business. 【 Our products】 -Web design ( UI/UX design) -Web development (including web system) -Digital Marketing (Facebook, Instagram, YouTube etc) -video editing.</p>
        </div>
        <div className="mt-[50px]">
          <h3 className="text-[26px] font-semibold">Our working environments</h3>
         <Slider/>
        </div>
        <div className="mt-[50px] pb-[100px]">
          <h3 className="text-[26px] font-semibold">Why Join Us</h3>
          <p className="mt-[20px] text-[#6B6B6B] text-[18px]">We are web development and digital marketing company. Our technology and knowledge are Japan. we can think about your success of the your business.please contact us if you want to get success of the business. 【 Our products】 -Web design ( UI/UX design) -Web development (including web system) -Digital Marketing (Facebook, Instagram, YouTube etc) -video editing.</p>
        </div>
        <div className="mt-[50px] pb-[100px]">
          <h3 className="text-[26px] font-semibold mb-[50px]">Posted Jobs</h3>
          <JobCardGrid jobs={jobs} onJobClick={handleJobClick} />
        </div>
      </div>
    </>
  );
}

export default OrganizationDetail
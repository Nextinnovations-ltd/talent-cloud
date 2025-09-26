import  { useState, useEffect } from "react";
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
import JobCardGrid from "@/components/jobApply/JobCardGrid";
import { useGetOrganizationDetailQuery } from "@/services/slices/organizationSlice";
import { Link } from "react-router-dom";

const OrganizationDetail = () => {
  const [loading, setLoading] = useState(true);
  const { data: organization, isLoading, isError } = useGetOrganizationDetailQuery('next-innovations');



  const jobs = organization?.job_posts ?? [];

  const handleJobClick = () => {

  };

  useEffect(() => {
    if (!isLoading) setLoading(false);
  }, [isLoading]);

  if (isLoading || loading) {
    return (
      <>
        <div
      className="w-full pt-[200px] h-[400px] bg-cover bg-center"
      style={{ backgroundImage: `url(${organization?.cover_image_url})` }}
    >
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

  if (isError || !organization) {
    return <div className="container mx-auto mt-20 text-center text-red-500">Failed to load organization details.</div>;
  }



  return (
    <>
      <div
      className="w-full pt-[200px] h-[400px] bg-cover bg-center"
      style={{ backgroundImage: `url(${organization?.cover_image_url})` }}
    >
        <div className="bg-white container 2xl:px-[50px] flex gap-[60px] rounded-lg px-[50px] items-center p-[20px] mx-auto w-full drop-shadow-md h-[400px] ">
          <div className="">
            <img  src={organization.image_url} width={160} className="rounded-full"/>
            <div className="flex gap-[32px] mt-[48px]">
              <Link to={organization?.linkedin_url} className="text-center flex flex-col items-center justify-center">
                <img src={LINKEDIN} width={32}/>
                <p className="text-[12px] mt-[5px]">LinkedIn</p>
              </Link>
              <Link to={organization?.instagram_url} className="text-center flex flex-col items-center justify-center">
                <img src={INSTAGRAM} width={32}/>
                <p className="text-[12px] mt-[5px]">Instagram</p>
              </Link>
              <Link to={organization?.facebook_url} className="text-center flex flex-col items-center justify-center">
                <img src={FACEBOOK} width={32}/>
                <p className="text-[12px] mt-[5px]">Facebook</p>
              </Link>
            </div>
            <div className="flex gap-[5px] mt-[30px]">
              <img width={24} src={WORLD}/>
              <a href={organization.website} target="_blank" rel="noopener noreferrer" className="underline text-[#F24539]">{organization.website.replace(/^https?:\/\//, '')}</a>
            </div>
          </div>
          <div>
            <h3 className="text-[32px] mb-[4px]">{organization.name}</h3>
            <p>{organization.tagline}</p>
            <div className='grid gap-[30px] my-[40px] grid-cols-3'>
              <InfoItem icon={BUILDING} text={organization.industry} alt="Industry" />
              <InfoItem icon={USERS} text={organization.size} alt="Size" />
              <InfoItem icon={PHONE} text={organization.contact_phone} alt="Phone" />
              <InfoItem icon={CALENDAR} text={new Date(organization.founded_date).toLocaleDateString()} alt="Founded" />
              <InfoItem icon={SHIELD} text={organization.is_verified ? 'Verified' : 'Unverified'} alt="Verified" />
              <InfoItem icon={LOCATION} text={organization.address} alt="Location" />
            </div>
            <p className="text-[#6B6B6B]">{organization.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-[280px] container 2xl:px-[50px] rounded-lg mx-auto">
        <div>
          <h3 className="text-[26px] font-semibold">About Company</h3>
          <p className="mt-[20px] text-[#6B6B6B] text-[18px]">{organization.description}</p>
        </div>
        <div className="mt-[50px]">
          <h3 className="text-[26px] font-semibold">Our working environments</h3>
          <Slider  />
        </div>
        <div className="mt-[50px] pb-[100px]">
          <h3 className="text-[26px] font-semibold">Why Join Us</h3>
          <p className="mt-[20px] text-[#6B6B6B] text-[18px]">{organization.why_join_us || organization.description}</p>
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
import React, { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import NEWIMAGE from '@/assets/New.png';
import BOOKMARK from '@/assets/Bookmark.svg'
import ACTIVEBOOKMARK from '@/assets/ActiveBookmark.png'
import TOOLTIP from '@/assets/BookmarkTooltip.png'
import SALARY from '@/assets/Dollar.svg'
import USER from '@/assets/User.svg'
import SKILLS from '@/assets/Skills.svg'
import DOT from '@/assets/Ellipse.svg'
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import DescriptionSplit from "@/pages/admin/CreateNewJob/StepsForms/Components/DescriptionSplit";

export type Job = {
  id: number;
  title: string;
  description: string;
  location: string;
  experience_level: string;
  experience_years: string | null;
  skills: string[];
  job_type: string;
  work_type: string;
  company_name: string;
  company_image_url: string;
  display_salary: string;
  created_at: string;
  applicant_count: number;
  is_new: boolean;
  is_bookmarked: boolean;
  is_applied: boolean;
  is_expired: boolean,
};

export type JobList = Job[];

interface ApplyJobCardProps {
  job: Job;
  onClick: (job: Job) => void;
  isSelected?: boolean;
}

const ApplyJobCard: React.FC<ApplyJobCardProps> = ({ job, onClick, isSelected = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      const yOffset = -200;
      const y = cardRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [isSelected]);


  return (
    <div className="relative w-[400px] 2xl:w-[400px] flex items-center justify-center mx-auto">
      <div
        ref={cardRef}
        className={`p-[30px] bg-white border-[#CBD5E1B2] duration-700 relative border-[2px] cursor-pointer min-h-[480px] h-full w-[350px] md:w-[360px]  2xl:w-[450px] xl:w-[400px] lg:w-[300px]   rounded-[17px] transition-colors flex flex-col ${
          isSelected ? " border-blue-500 border-[3px] " : "hover:border-blue-500"
        } ${job?.is_expired && 'opacity-100'}`}
        onClick={() => onClick(job)}
      >
        {job?.is_new && <img width={64} className="absolute top-[-15px] left-[-2px]" height={48} src={NEWIMAGE} />}
        
        <div className="flex justify-between items-start">
          <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 14 }}>
            {!isImageLoaded && (
              <div
                className="mb-[14px] rounded-full bg-gray-200 animate-pulse"
                style={{ width: 64, height: 64 }}
              />
            )}
            <img
              width={64}
              height={64}
              className="mb-[14px] rounded-full"
              src={job?.company_image_url}
              style={{ display: isImageLoaded ? 'block' : 'none', position: 'absolute', top: 0, left: 0 }}
              onLoad={() => setIsImageLoaded(true)}
              alt="Company Logo"
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className={`w-[50px] h-[50px] rounded-full duration-500 hover:bg-slate-50 flex items-center justify-center ${job?.is_bookmarked && 'bg-[#0389FF1F] hover:bg-blue-200'}`}>
                  <img width={24} height={24} src={job?.is_bookmarked ? ACTIVEBOOKMARK : BOOKMARK} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <img width={68} src={TOOLTIP} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <h4 className="font-semibold text-[18px]">{job.title}</h4>
        <h4 className="text-[#6B6B6B] text-[16px]">{job.company_name}</h4>

        <div className="gap-[10px] mt-4">
          <div className="flex gap-2">
            <img width={18} height={18} src={SALARY} />
            <h3 className="font-semibold text-[14px]">{job.display_salary}</h3>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <img width={18} height={18} src={USER} />
          <h3 className="text-[#6B6B6B] text-[14px]">{job.job_type}</h3>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <img width={18} height={18} src={SKILLS} />
          <div className="text-[#6B6B6B] flex flex-wrap gap-2 items-center">
            {job.skills.slice(0, 2).map((item, index) => (
              <Badge
                key={index}
                className={`border px-[10px] capitalize bg-[#F2F2F2] rounded-[8px] py-[4px] text-[14px] font-normal text-black max-w-[110px] `}
              >
                <p className="truncate">{item}</p>
              </Badge>
            ))}
            {job.skills.length > 2 && (
              <Badge className={`border px-[10px] bg-[#F2F2F2] rounded-[8px] py-[4px] text-[14px] font-normal text-black truncate max-w-[120px] `}>
                ...
              </Badge>
            )}
          </div>
        </div>

        <DescriptionSplit content={job?.description}/>

        <div className="border-t-[1px] border-slate-300 my-[20px]"></div>

        <div className="flex  text-[14px] justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-[#6B6B6B]">{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</h3>
            <img width={4} height={4} src={DOT} />
            <h3 className="text-[#6B6B6B]">{job.applicant_count} Applicants</h3>
          </div>
          {job?.is_expired 
            ? null
            : job.is_applied && <h3 className="text-[#0481EF]">Applied</h3>
          }
        </div>
        
        {/* Absolutely positioned Expired text */}
        {job?.is_expired && (
          <h3 className="text-red-500 absolute bottom-6 right-6 bg-white px-2 py-1 rounded opacity-100">
            Expired
          </h3>
        )}
      </div>
    </div>
  );
};

export default ApplyJobCard;
import React, { useEffect, useRef } from "react";
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
  is_bookmarked:boolean
};

export type JobList = Job[];

interface ApplyJobCardProps {
  job: Job;
  onClick: (job: Job) => void;
  isSelected?: boolean;
}

const ApplyJobCard: React.FC<ApplyJobCardProps> = ({ job, onClick, isSelected = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      const yOffset = -200;
      const y = cardRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [isSelected]);

  return (
    <div
      ref={cardRef}
      className={`p-[30px] border-[#CBD5E1B2] duration-700 relative border-[2px] cursor-pointer min-h-[429px] w-[400px] mx-auto rounded-[17px] transition-colors flex flex-col ${
        isSelected ? " border-blue-500 border-[3px] " : "hover:border-blue-500"
      }`}
      onClick={() => onClick(job)}
    >
    {
      job?.is_new &&   <img width={64} className="absolute top-[-15px] left-[-2px]" height={48} src={NEWIMAGE} />
    }
      <div className="flex justify-between items-start">
        <img width={64} height={64} className="mb-[14px] rounded-full" src={job?.company_image_url} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
             <div className={`w-[50px] h-[50px] rounded-full duration-500 hover:bg-slate-50 flex items-center justify-center ${job?.is_bookmarked && 'bg-[#0389FF1F] hover:bg-blue-200'}`}>
             <img width={24} height={24}  src={job?.is_bookmarked ? ACTIVEBOOKMARK:BOOKMARK} />
             </div>
            </TooltipTrigger>
            <TooltipContent  >
             <img width={68} src={TOOLTIP}/>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <h4 className="font-semibold text-[18px]">{job.title}</h4>
      <h4 className="text-[#6B6B6B] text-[16px]">{job.company_name}</h4>

      <div className="gap-[10px]">
        <div className="flex gap-2 mt-[22px]">
          <img width={18} height={18} className="mb-[14px]" src={SALARY} />
          <h3 className="font-semibold text-[14px]">{job.display_salary}</h3>
        </div>
      </div>

      <div className="flex gap-2">
        <img width={18} height={18} className="mb-[14px]" src={USER} />
        <h3 className="text-[#6B6B6B] text-[14px]">{job.job_type}</h3>
      </div>

      <div className="flex items-center gap-2">
        <img width={18} height={18} src={SKILLS} />
        <div className="text-[#6B6B6B] flex flex-wrap gap-2 items-center">
          {job.skills.slice(0, 2).map((item, index) => (
            <Badge
              key={index}
              className={`border px-[10px] bg-[#F2F2F2] rounded-[8px] py-[4px] text-[14px] font-normal text-black max-w-[110px] `}
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

      <h3 className="mt-[23px] mb-[23px] text-[14px] line-clamp-3">{job.description}</h3>

      <div className="border-t-[1px] border-slate-300"></div>

      <div className="flex mt-[20px] text-[14px] items-center gap-2">
        <h3 className="text-[#6B6B6B]">{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</h3>
        <img width={4} height={4} src={DOT} />
        <h3 className="text-[#6B6B6B]">{job.applicant_count} Applicants</h3>
      </div>
    </div>
  );
};

export default ApplyJobCard;

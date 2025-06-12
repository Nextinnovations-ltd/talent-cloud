import React, { useEffect, useRef } from "react";
import NEWIMAGE from '@/assets/New.png';
import BOOKMARK from '@/assets/Bookmark.svg'
import SALARY from '@/assets/Dollar.svg'
import USER from '@/assets/User.svg'
import SKILLS from '@/assets/Skills.svg'
import DOT from '@/assets/Ellipse.svg'
import { Badge } from "../ui/badge";



export interface Job {
  id: number;
  title: string;
  companyName: string;
  img:string;
  salary:string;
  salaryCurrency:string;
  jobType:string;
  skills:string[];
  description:string;
  created_at:string;
  applicants:string
}

interface ApplyJobCardProps {
  job: Job;
  onClick: (job: Job) => void;
  isSelected?: boolean;
}

const ApplyJobCard: React.FC<ApplyJobCardProps> = ({ job, onClick, isSelected = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      const yOffset = -120;
       const y = cardRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
       window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [isSelected]);

  return (
    <div
      ref={cardRef}
      className={`p-[30px]  relative border cursor-pointer min-h-[400px] w-[396px] mx-auto  rounded-lg transition-colors duration-200 ${
        isSelected ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"
      }`}
      onClick={() => onClick(job)}
    >

      <img width={64} className="absolute top-[-15px] left-0 " height={48} src={NEWIMAGE}/>
     <div className="flex justify-between items-start">
     <img width={64} height={64} className="mb-[14px]" src={job.img}/>
     <img width={18} height={18} className="mb-[14px]" src={BOOKMARK}/>

     </div>
      <h4 className="font-semibold text-[18px] ">{job.title}</h4>
      <h4 className=" text-[#6B6B6B] text-[16px]">{job.companyName}</h4>

<div className="gap-[10px]">
<div className="flex gap-2 mt-[22px]">
      <img width={18} height={18} className="mb-[14px]" src={SALARY}/>
      <h3 className="font-semibold text-[14px]">{job.salary}</h3>
      <h3 className="text-[#6B6B6B]  text-[14px]">{job.salaryCurrency}</h3>
      </div>
</div>

<div className="flex gap-2">
<img width={18} height={18} className="mb-[14px]" src={USER}/>
<h3 className="text-[#6B6B6B] text-[14px]">{job.jobType}</h3>
</div>

<div className="flex items-center gap-2">
<img width={18} height={18}  src={SKILLS}/>
<div className="text-[#6B6B6B] flex flex-wrap  gap-2 items-center">
  {job.skills.slice(0, 2).map((item, index) => (
    <Badge
      key={index}
      className={`border px-[10px] bg-[#F2F2F2]  rounded-[8px] py-[4px] text-[14px] font-normal text-black ${isSelected && 'bg-blue-200'}`}
    >
      {item}
    </Badge>
  ))}
  {job.skills.length > 2 && (
    <Badge   className={`border px-[10px] bg-[#F2F2F2] rounded-[8px] py-[4px] text-[14px] font-normal text-black ${isSelected && 'bg-blue-200'}`}>
      ...
    </Badge>
  )}
</div>

</div>

<h3 className="mt-[23px] mb-[14px] text-[14px] line-clamp-2 ">{job.description}</h3>


<div className="border-t-[1px] border-slate-300"></div>

<div className="flex mt-[10px] text-[14px] items-center gap-2">
<h3 className="text-[#6B6B6B]">an hour ago</h3>
<img width={4} height={4}  src={DOT}/>
<h3 className="text-[#6B6B6B]">20 Applicants</h3>

</div>

    </div>
  );
};

export default ApplyJobCard;

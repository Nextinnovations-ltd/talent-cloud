import CompanyIcon from "@/assets/SuperAdmin/company.svg";
import Calendar from "@/assets/SuperAdmin/calendar-clock.svg";
import Eye from "@/assets/SuperAdmin/eye.svg";
import UserIcon from "@/assets/SuperAdmin/users.svg";
// import TOOLTIP from '@/assets/SuperAdmin/Tooltip.png';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
// import { useState } from "react";
// import { JobCardSwitch } from "./JobCardSwitch";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  specialization: string;
  status: string;
  applicants: number;
  views: number;
  postedDate: string;
  deadlineDate: string;
}

const JobCard = ({
  id,
  title,
  company,
  applicants,
  views,
  deadlineDate,
  status,
}: JobCardProps) => {
  // const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  // Format date to display as "Month Day Year" (e.g., "July 10 2025")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="px-[21.5px] py-[15.5px] border border-[#CBD5E1] rounded-xl">
      <div className="flex justify-between items-start">
        {/* Position Section */}
        <div className="font-medium leading-[135%]">
          <h3 className="text-[14px] text-[#575757]">Position</h3>
          <h3 className="text-[16px] mt-2 text-[#000] w-[200px] line-clamp-2">{title}</h3>
        </div>

        {/* Status Badge */}
        <div
          className={`px-[17.5px] py-2 rounded-[12px] ${status === "active" ? "bg-[#D0FEDE]" : "bg-[#FFD5D5]"
            }`}
        >
          <p
            className={`text-[12px] font-normal leading-[135%] ${status === "active" ? "text-[#00AD42]" : "text-[#FF0000]"
              }`}
          >
            {status === "active" ? "Active" : "Inactive"}
          </p>
        </div>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <JobCardSwitch valueCheck={isChecked} onValueCheckChange={setIsChecked} />
            </TooltipTrigger>
            <TooltipContent>
              <img width={75} src={TOOLTIP} alt="Tooltip" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

      </div>

      <div className="space-y-[12px] mt-[12px] text-[#575757] text-[12px] font-medium leading-[135%]">
        <div className="flex items-center gap-[12px]">
          <img src={CompanyIcon} alt="Company" />
          <p>{company}</p>
        </div>
        <div className="flex items-center gap-[12px]">
          <img src={Calendar} alt="Calendar" />
          <p>Deadline : <span className={`text-[14px] ${status == "active" ? "" : "text-[#DB2323]"}`}>{formatDate(deadlineDate)}</span></p>
        </div>
        <div className="flex items-center gap-[12px]">
          <img src={Eye} alt="Views" />
          <p>Views : <span className="text-[#0481EF] text-[14px] ">{views}</span></p>
        </div>
        <div className="flex items-center gap-[12px]">
          <img src={UserIcon} alt="Applicants" />
          <p className="text-[#0481EF]">Applicants : <span className="text-[14px]">{applicants}</span></p>
        </div>
      </div>

      <div className="flex items-center justify-around mt-[24.5px]">
        <button onClick={() => navigate(`/admin/dashboard/allJobs/details/applicants/${id}`)} className="bg-[#F3F9FF] hover:bg-[#e2e8ee] hover:scale-105 p-2 rounded-full group">
          <Users color="#575757" size={20} />
        </button>
        <button onClick={() => navigate(`/admin/dashboard/allJobs/${id}`)} className="bg-[#F3F9FF] hover:bg-[#e2e8ee] hover:scale-105 p-2 rounded-full group">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.3335 8C1.3335 8 3.3335 3.33333 8.00016 3.33333C12.6668 3.33333 14.6668 8 14.6668 8C14.6668 8 12.6668 12.6667 8.00016 12.6667C3.3335 12.6667 1.3335 8 1.3335 8Z"
              className="stroke-[#575757] group-hover:stroke-black transition-colors"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
              className="stroke-[#575757] group-hover:stroke-black transition-colors"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button onClick={() => navigate(`/admin/dashboard/allJobs/editJobs/${id}`)} className="bg-[#F3F9FF] hover:bg-[#e2e8ee] hover:scale-105 p-2 rounded-full group">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 13.3333H14" className="stroke-[#575757] group-hover:stroke-black transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 2.33333C11.2652 2.06811 11.6249 1.91911 12 1.91911C12.1857 1.91911 12.3696 1.95569 12.5412 2.02676C12.7128 2.09783 12.8687 2.202 13 2.33333C13.1313 2.46465 13.2355 2.62055 13.3066 2.79213C13.3776 2.96371 13.4142 3.14761 13.4142 3.33333C13.4142 3.51904 13.3776 3.70294 13.3066 3.87452C13.2355 4.0461 13.1313 4.202 13 4.33333L4.66667 12.6667L2 13.3333L2.66667 10.6667L11 2.33333Z"
              className="stroke-[#575757] group-hover:stroke-black transition-colors"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default JobCard;
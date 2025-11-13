import { FilterCombo } from "../common/ApplyJob/FilterCombo";
import { SalaryRangeFilter } from "../common/ApplyJob/SalaryRangeFilter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const JOBTYPEDATA = [
    {
      value: "full_time",
      label: "Full-Time",
    },
    {
      value: "part_time",
      label: "Part-Time",
    },
  ]
  
  const WORKYPEDATA = [
    {
      value: "onsite",
      label: "Onsite",
    },
    {
      value: "remote",
      label: "Remote",
    },
    {
        value: "hybrid",
        label: "Hybrid",
      },
  ]
  
  //const SALARYMODETYPE = [
 //   {
  //      value: "fixed",
   //     label: "Fixed",
    //  },
     // {
       // value: "range",
        //label: "Range",
      //},
  //]

  const PROJECTDURATIONTYPE = [
    {
        value: "less_than_1_month",
        label: "Less than 1 month",
      },
      {
        value: "1_to_3_months",
        label: "1 to 3 months",
      },
      {
        value: "3_to_6_months",
        label: "3 to 6 months",
      },
      {
        value: "more_than_6_months",
        label: "More than 6 months",
      },
      {
        value: "ongoing",
        label: "Ongoing / Indefinite",
      },
  ]

interface ApplyJobFiltersProps {
  onFiltersChange: (filters: {
    job_type?: string;
    work_type?: string;
    salary_mode?: string;
    project_duration?: string;
    salary_rate?: string;
  }) => void;
}

export const ApplyJobFilters: React.FC<ApplyJobFiltersProps> = ({ onFiltersChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    
    const y = useTransform(scrollY, [0, 100], [0, -1]);
    const scale = useTransform(scrollY, [0, 100], [1, 0.98]);
    const boxShadow = useTransform(
        scrollY,
        [0, 100],
        ["0px 0px 0px rgba(0,0,0,0)", "0px 2px 6px rgba(0,0,0,0.08)"]
    );

    const handleFilterChange = (key: string, value: string) => {
        onFiltersChange({ [key]: value });
    };

    return (
        <motion.div
            ref={containerRef}
            style={{
                y,
                scale,
                boxShadow,
            }}
            className="sticky top-[100px] z-[99] container h-[64px] bg-[#F3F4F6] rounded-[10px] mx-auto mb-[50px] items-center gap-[8px] p-4 flex  justify-start"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.3,
                ease: "easeOut"
            }}
        >
           <FilterCombo 
                data={JOBTYPEDATA} 
                title="Work type" 
                onFilterChange={(value) => handleFilterChange('job_type', value)}
                filterKey="job_type"
           />
           <FilterCombo 
                data={WORKYPEDATA} 
                title="Remote" 
                onFilterChange={(value) => handleFilterChange('work_type', value)}
                filterKey="work_type"
           />
           <SalaryRangeFilter
                title="Salary Range"
                onFilterChange={(value) => handleFilterChange('salary_rate', value)}
           />
           <FilterCombo 
                data={PROJECTDURATIONTYPE} 
                title="Project Duration" 
                onFilterChange={(value) => handleFilterChange('project_duration', value)}
                filterKey="project_duration"
           />
        </motion.div>
    )
}

export default ApplyJobFilters;

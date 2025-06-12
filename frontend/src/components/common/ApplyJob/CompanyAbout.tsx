import React from 'react';
import { CompanyHeader } from './CompanyHeader';
import { CompanyInfoGrid } from './CompanyInfoGrid';
import { Job } from '@/components/jobApply/ApplyJobCard';

interface CompanyAbout {
    job: Job;
  }
  

export const CompanyAbout: React.FC<CompanyAbout> = ({job}) => (
  <>
   <div className='mb-[30px]'>
   <h3 className="mt-[23px] mb-[14px] font-semibold text-[18px] line-clamp-2">About Company</h3>
    <CompanyHeader companyName="Molax Co,Ltd. By Seek" />
    <p>At Molex, we believe in the transformative power of creating connections. Obstacles become opportunity through innovation, engineering expertise, collaborative customer experiences and industry-leading interconnect solutions...</p>
   </div>

    <CompanyInfoGrid job={job}/>
  </>
); 
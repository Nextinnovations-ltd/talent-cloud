import React from 'react';
import { CompanyHeader } from './CompanyHeader';
import { CompanyInfoGrid } from './CompanyInfoGrid';
import { JOBDETAILTYPES } from '@/types/job-apply';





interface CompanyAbout {
    job: JOBDETAILTYPES;
  }
  

export const CompanyAbout: React.FC<CompanyAbout> = ({job}) => (
  <>
   <div className='mb-[30px]'>
   <h3 className="mt-[23px] mb-[14px] font-semibold text-[18px] line-clamp-2">About Company</h3>
    <CompanyHeader companyLogo={job?.company?.image_url || ''} companyName={job?.company.name} />
    <p>{job?.company?.description || ''}</p>
   </div>

    <CompanyInfoGrid job={job}/>
  </>
); 
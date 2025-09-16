import React from 'react';
import { CompanyHeader } from './CompanyHeader';
import { CompanyInfoGrid } from './CompanyInfoGrid';
import { JOBDETAILTYPES } from '@/types/job-apply';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CompanyAbout {
  job: JOBDETAILTYPES;
}


export const CompanyAbout: React.FC<CompanyAbout> = ({ job }) => (

  <>
    <div className='mb-[30px] border-2 p-[20px] rounded-[20px] mt-[30px]'>
      <div className='flex  items-center justify-between'>
        <h3 className=" font-semibold text-[18px] line-clamp-2">About Company</h3>
        <Link to={'/organization/detail/2'} className='text-[#0389FF] text-sm items-center justify-center flex gap-[6px]'> <ExternalLink size={16} />More</Link>
      </div>
      <CompanyHeader companyLogo={job?.company?.image_url || ''} companyName={job?.company.name} />
      <p className=' line-clamp-3'>{job?.company?.description || ''}</p>
      <CompanyInfoGrid job={job} />
    </div>

  </>
); 
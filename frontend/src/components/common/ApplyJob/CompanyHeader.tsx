import React from 'react';

interface CompanyHeaderProps {
  companyName: string;
  companyLogo:string
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ companyName,companyLogo }) => (
  <div className='flex items-center gap-[8px] mt-[20px] mb-[32px]'>
    <img width={62} height={62} className=' rounded-2xl' src={companyLogo} alt="Company Logo"/>
    <p className='text-[16px] font-normal text-[#575757]'>{companyName}</p>
  </div>
); 
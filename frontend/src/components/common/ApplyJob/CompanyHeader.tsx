import React from 'react';

interface CompanyHeaderProps {
  companyName: string;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ companyName }) => (
  <div className='flex items-center mt-[20px] mb-[32px]'>
    <img width={62} height={62} src='https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png' alt="Company Logo"/>
    <p className='text-[16px] font-normal text-[#575757]'>{companyName}</p>
  </div>
); 
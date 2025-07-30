import React from 'react';

interface CompanyHeaderProps {
  companyName: string;
  companyLogo:string
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ companyName,companyLogo }) => (
  <div className='flex items-center gap-[8px] mt-[20px] mb-[32px]'>
  {
    companyLogo ? (
      <img width={62} height={62} className='rounded-2xl' src={companyLogo} alt="Company Logo" />
    ) : (
      <div
        style={{ width: 62, height: 62 }}
        className='rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold'
        aria-label="No Company Logo"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="12" fill="#E5E7EB"/>
          <path d="M12 13.5C13.3807 13.5 14.5 12.3807 14.5 11C14.5 9.61929 13.3807 8.5 12 8.5C10.6193 8.5 9.5 9.61929 9.5 11C9.5 12.3807 10.6193 13.5 12 13.5Z" fill="#9CA3AF"/>
          <path d="M6 18C6 15.7909 9.58172 14 12 14C14.4183 14 18 15.7909 18 18" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    )
  }
    <p className='text-[16px] font-normal text-[#575757]'>{companyName}</p>
  </div>
); 
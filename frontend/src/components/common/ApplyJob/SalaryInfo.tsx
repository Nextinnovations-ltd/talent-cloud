import React from 'react';
import SALARY from '@/assets/Dollar.svg';

interface SalaryInfoProps {
  salary: string | undefined;
  currency: string | undefined;
}

export const SalaryInfo: React.FC<SalaryInfoProps> = ({ salary, currency }) => (
  <div className="flex gap-2 items-center">
    <img width={24} height={24} src={SALARY} alt="Salary"/>
    <h3 className="font-semibold">{salary}</h3>
    <h3 className="text-[#6B6B6B] text-[14px]">{currency}</h3>
  </div>
); 
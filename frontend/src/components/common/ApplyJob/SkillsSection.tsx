import React from 'react';
import { Badge } from '../../ui/badge';
import SKILLS from '@/assets/Skills.svg';

interface SkillsSectionProps {
  skills: string[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => (
  <div className="flex items-center mb-[50px] gap-2">
    <img width={24} height={24} src={SKILLS} alt="Skills"/>
    <div className="text-[#6B6B6B] w-full flex gap-2 items-center">
      {skills.slice(0, 3).map((item, index) => (
        <Badge
          key={index}
          className="border inline-block px-[10px] bg-[#F2F2F2] rounded-[8px] py-[4px] text-[14px] font-normal text-black"
        >
          {item}
        </Badge>
      ))}
      {skills.length > 2 && (
        <Badge className="border px-[10px] bg-[#F2F2F2] rounded-[8px] py-[4px] text-[14px] font-normal text-black">
          ...
        </Badge>
      )}
    </div>
  </div>
); 
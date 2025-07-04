import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import SKILLS from '@/assets/Skills.svg';
import { Button } from '@/components/ui/button';

interface SkillsSectionProps {
  skills: string[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [expanded, setExpanded] = useState(false);
  const showToggle = skills.length > 10;
  const displayedSkills = expanded ? skills : skills.slice(0, 3);

  return (
    <div className="flex items-center mb-[50px] gap-2">
      <img width={24} height={24} src={SKILLS} alt="Skills"/>
      <div className="text-[#7e6868] w-full flex flex-wrap gap-2 items-center">
        {displayedSkills.map((item, index) => (
          <Badge
            key={index}
            className="border inline-block  px-[10px] bg-[#F2F2F2] rounded-[8px] py-[4px] text-[14px] font-normal text-black"
          >
            {item}
          </Badge>
        ))}
        {showToggle && (
          <Button
            variant={'ghost'}
            type="button"
            className=" px-[10px]  rounded-[8px] py-[4px] text-[14px] font-normal text-[#0481EF] focus:outline-none"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </Button>
        )}
      </div>
    </div>
  );
}; 
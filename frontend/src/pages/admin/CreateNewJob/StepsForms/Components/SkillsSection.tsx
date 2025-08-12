import SKILLS from '@/assets/Skills.svg';
import { useFormattedSkills } from '@/lib/dropData.tsx/ReturnSkills';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SkillsSectionProps {
    skills: string[]; // Assuming this is an array of skill IDs (as strings)
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
    const [expanded, setExpanded] = useState(false);
    const { data: FORMATTEDDATA } = useFormattedSkills();
    const showToggle = skills.length > 3;
    const displayedSkills = expanded ? skills : skills.slice(0, 3);

    // Function to get skill label by ID
    const getSkillLabel = (skillId: string) => {
        if (!FORMATTEDDATA) return skillId; // Fallback to ID if formatted data not loaded
        const skill = FORMATTEDDATA.find(item => item.value?.toLocaleString() === skillId);
        return skill ? skill.label : skillId;
    };

    return (
        <div className="flex items-center mb-[50px] mt-[30px] gap-2">
            <img width={24} height={24} src={SKILLS} alt="Skills" />
            <div className="text-[#7e6868] w-full flex flex-wrap gap-2 items-center">
                {displayedSkills.map((skillId, index) => (
                    <Badge
                        key={index}
                        className="border capitalize  inline-block px-[10px] bg-[#F2F2F2] rounded-[8px] py-[4px] text-[14px] font-normal text-black"
                    >
                        {getSkillLabel(skillId)}
                    </Badge>
                ))}
                {showToggle && (
                    <Button
                        variant={'ghost'}
                        type="button"
                        className="px-[10px] rounded-[8px] py-[4px] text-[14px] font-normal text-[#0481EF] focus:outline-none"
                        onClick={() => setExpanded((prev) => !prev)}
                    >
                        {expanded ? 'Show less' : `+${skills.length - 3} more`}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default SkillsSection;
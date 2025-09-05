import { Badge } from "@/components/ui/badge"
import { useState } from "react"

const DEFAULT_VISIBLE = 9

type CandidateSkillsProps = {
  skillArray: string[]
}

export const CandidateSkills: React.FC<CandidateSkillsProps> = ({ skillArray }) => {
  const [showFull, setShowFull] = useState(false)
  const leftToShow = skillArray.length - DEFAULT_VISIBLE

  const visibleSkills = showFull ? skillArray : skillArray.slice(0, DEFAULT_VISIBLE)

  return (
    <>
      <h3 className="text-[20px] mt-[36px] font-semibold">Skills</h3>

      <div className="text-[#6B6B6B] mt-[24px] flex flex-wrap gap-2 items-center">
        {visibleSkills.map((item, index) => (
          <Badge
            key={index}
            className="border px-[10px] capitalize bg-[#F2F2F2] rounded-[8px] py-[4px] text-[14px] font-normal text-black"
          >
            {item}
          </Badge>
        ))}

        {skillArray.length > DEFAULT_VISIBLE && (
          <span
            title="Toggle more skills"
            onClick={() => setShowFull((prev) => !prev)}
            className="text-[14px] hover:underline cursor-pointer text-[#6B6B6B]"
          >
            {showFull ? "less skills" : `+${leftToShow} skills`}
          </span>
        )}
      </div>
    </>
  )
}

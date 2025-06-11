import {
  JuniorExperienceIcon,
  MidExperienceIcon,
  SeniorExperienceIcon,
} from "@/assets/svgs/svgs";
import clsx from "clsx";

interface ExperienceCardProps {
  active: boolean;
  title: string;
  handleClick: any;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  active,
  title,
  handleClick,
}) => {
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-[187px] h-[162px] rounded-[14px] border-[1px] flex items-center gap-[16px] justify-center flex-col border-[#CBD5E1]  cursor-pointer hover:translate-y-[-5px]  hover:shadow-md duration-500 bg-white",
        active && "border-2 border-[#0389FF] bg-[#0389FF26] ",
        "hover:border-[#0389FF] hover:bg-[#0389FF26] "
      )}
    >
      {title === "Junior Level" && <JuniorExperienceIcon />}
      {title === "Mid Level" && <MidExperienceIcon />}
      {title === "Senior Level" && <SeniorExperienceIcon />}
      <h3 className="text-[#05060F]">{title}</h3>
    </div>
  );
};

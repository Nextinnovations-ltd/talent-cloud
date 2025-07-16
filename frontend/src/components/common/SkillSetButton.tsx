import clsx from "clsx";
import { Button } from "../ui/button";

interface SkillSetButtonProps {
  title: string;
  onClick: () => void;
  isSelected: boolean;
}

export const SkillSetButton: React.FC<SkillSetButtonProps> = ({
  title,
  onClick,
  isSelected,
}) => {
  return (
    <Button
      className={clsx(
        "py-[12px] px-[24px]  border-[1px] hover:bg-none h-[48px] duration-500 rounded-[40px]",
        " hover:shadow-md capitalize",
        isSelected
          ? " text-black bg-[#0389FF26] border-[#0389FF] border-[1px] hover:bg-[#0389FF26] hover:text-black"
          : "   text-black"
      )}
      variant={"outline"}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

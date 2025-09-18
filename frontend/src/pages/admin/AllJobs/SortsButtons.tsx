import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type SortsButtonProps = {
  title: string;
  field: string; // e.g. 'created_at'
  currentSort: string; // e.g. '-created_at' or 'created_at'
  onToggle: (newSort: string) => void;
};

const SortsButtons = ({ title, field, currentSort, onToggle }: SortsButtonProps) => {
  const isDesc = currentSort === `-${field}`;
  const isActive = currentSort === field || isDesc;

  const handleClick = () => {
    const newSort = isDesc ? field : `-${field}`;
    onToggle(newSort);
  };

  return (
    <div className="flex items-center gap-[12px] ">
      <p className="text-[12px] text-[#6B6B6B] font-medium">SORT BY</p>
      <Button
        onClick={handleClick}
        type="button"
        className={`px-[16px]  border-[#515151] border h-[36px] rounded-[8px] bg-[#ffffff] flex items-center gap-2`}
      >
        <p className={`text-[#575757] ${isActive ? " " : ""} `}>{title}</p>
        {isDesc ? <ChevronDown /> : <ChevronUp />}
      </Button>
    </div>
  );
};

export default SortsButtons;

//ring-[#D1D5DB]
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
    <Button
      onClick={handleClick}
      type="button"
      className={`px-7 h-[48px] rounded-[20px] bg-[#F3F4F6] flex items-center gap-2 ${isActive ? "ring-2 ring-[#D1D5DB]" : ""}`}
    >
      <p className="text-[#575757]">{title}</p>
      {isDesc ?   <ChevronUp /> : <ChevronDown />}
    </Button>
  );
};

export default SortsButtons;

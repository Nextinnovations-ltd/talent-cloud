import SvgBackChevron from "@/assets/svgs/SvgBackChevron";
import { cn } from "@/lib/utils";

const BackButton = ({ handleBack,className  }: { handleBack: () => void,className?:string }) => {
  return (
    <button
      title="Back "
      className={cn('w-[62px] h-[62px] hover:bg-slate-100  rounded-full border-[1px] border-[#CBD5E1] flex items-center justify-center',className)}
      onClick={handleBack}
    >
      <SvgBackChevron  />
    </button>
  );
};

export default BackButton;

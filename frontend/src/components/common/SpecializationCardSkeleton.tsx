import clsx from "clsx";
import { Skeleton } from "../ui/skeleton";

function SpecializationCardSkeleton() {
  return (
    <div
      className={clsx(
        "w-[306px] border-[1px] border-[#CBD5E1]  hover:translate-y-[-5px] cursor-pointer hover:shadow-md duration-500 h-[116px]  rounded-[14px] flex items-center justify-start gap-[21px] px-5 "
      )}
    >
      <Skeleton className="h-12 w-12  rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[180px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}

export default SpecializationCardSkeleton;

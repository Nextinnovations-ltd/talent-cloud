import { Skeleton } from "@/components/ui/skeleton";



 const JobCardSkeleton = () => {
  return (
    <div className="px-[21.5px] py-[15.5px] border border-[#CBD5E1] rounded-xl">
      <div className="flex justify-between items-start">
        <div className="font-medium leading-[135%] w-full">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-5 w-2/3 mt-2" />
        </div>
        <Skeleton className="h-6 w-11 rounded-full" />
      </div>

      <div className="space-y-[12px] mt-[12px]">
        <div className="flex items-center gap-[12px]">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex items-center gap-[12px]">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex items-center gap-[12px]">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center gap-[12px]">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      <div className="flex items-center justify-around mt-[24.5px]">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
};

export default JobCardSkeleton;
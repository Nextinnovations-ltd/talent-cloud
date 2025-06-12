
import clsx from "clsx";
import { Skeleton } from "../ui/skeleton";

function SkillSetSkeleton() {
  return (
    <Skeleton
      className={clsx(
        "py-[12px] px-[24px] w-[150px]  border-[1px] hover:bg-none h-[48px] duration-1000 rounded-[40px]",
        " hover:shadow-md"
      )}
    >
      {/* <Skeleton className="h-4 w-[100px]" /> */}
    </Skeleton>
  );
}

export default SkillSetSkeleton;

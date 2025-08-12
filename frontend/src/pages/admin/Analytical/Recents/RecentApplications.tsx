/* eslint-disable @typescript-eslint/ban-ts-comment */
import RecentApplicant from "@/components/superAdmin/RecentApplicant";
import { RecenTitles } from "./RecenTitles";
import { useGetAllRecentApplicantsListQuery } from "@/services/slices/adminSlice";
import { Skeleton } from "@/components/ui/skeleton"; // Optional: for loading state

const RecentApplications = () => {
  const { data, isLoading } = useGetAllRecentApplicantsListQuery();
  const recentApplicants = data?.data;


  return (
    <div className="w-1/2 flex flex-col gap-5">
      <RecenTitles title="Recent Applicants" />
      
      {isLoading ? (
        // Loading state (optional)
        Array(4).fill(0).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} className="h-20 w-full" />
        ))
      ) : (
        // Render actual applicants
         //@ts-expect-error
        recentApplicants?.slice(0, 4).map((applicant) => (
          <RecentApplicant key={applicant.applicant_id} data={applicant} />
        )) ?? null
      )}
    </div>
  );
};

export default RecentApplications;
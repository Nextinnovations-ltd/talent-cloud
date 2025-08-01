import RecentApplicant from "@/components/superAdmin/RecentApplicant";
import { RecenTitles } from "./RecenTitles";
import { useGetAllRecentApplicantsListQuery } from "@/services/slices/adminSlice";
import { Skeleton } from "@/components/ui/skeleton"; // Optional: for loading state

const RecentApplications = () => {
  const { data, isLoading } = useGetAllRecentApplicantsListQuery();
  const recentApplicants = data?.data;

  

 console.log("999999")
  console.log(recentApplicants)
 console.log("999999")


  return (
    <div className="w-1/2 flex flex-col gap-5">
      <RecenTitles title="Recent Applicants" />
      
      {isLoading ? (
        // Loading state (optional)
        Array(4).fill(0).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} className="h-20 w-full" />
        ))
      ) : recentApplicants?.length ? (
        // Render actual applicants
        recentApplicants.slice(0, 4).map((applicant) => (
          <RecentApplicant key={applicant.applicant_id} data={applicant} />
        ))
      ) : (
        // Fallback when no data
        Array(4).fill(0).map((_, index) => (
          <RecentApplicant key={`empty-${index}`} />
        ))
      )}
    </div>
  );
};

export default RecentApplications;
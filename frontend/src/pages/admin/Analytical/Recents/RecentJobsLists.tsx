import RecentJobCard from "@/components/superAdmin/RecentJobCard"
import { RecenTitles } from "./RecenTitles"
import { useGetAllRecentJobsListQuery } from "@/services/slices/adminSlice";
import { Skeleton } from "@/components/ui/skeleton";


 const RecentJobsLists = () => {

  const { data, isLoading } = useGetAllRecentJobsListQuery();
  const recentApplicants = data?.data?.results;


  console.log({recentApplicants})


  
  return (
    <div className="w-1/2 flex flex-col gap-5">
        <RecenTitles title="Recent Jobs"/>

        {isLoading && (
        // Loading state (optional)
        Array(4).fill(0).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} className="h-20 w-full" />
        ))
      )}
      {
        recentApplicants?.length  &&  recentApplicants.slice(0, 4).map((applicant) => (
          <RecentJobCard key={applicant.id} data={applicant} />
        ))
      }
    </div>
  )
}

export default RecentJobsLists

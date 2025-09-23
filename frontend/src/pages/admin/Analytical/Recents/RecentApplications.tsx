/* eslint-disable @typescript-eslint/ban-ts-comment */
import RecentApplicant from "@/components/superAdmin/RecentApplicant";
import { RecenTitles } from "./RecenTitles";
import { useGetAllRecentApplicantsListQuery } from "@/services/slices/adminSlice";
import { Skeleton } from "@/components/ui/skeleton"; // Optional: for loading state
import { useNavigate } from "react-router-dom";


const RecentApplications = () => {
  const { data, isLoading } = useGetAllRecentApplicantsListQuery();
  const recentApplicants = data?.data;
  const navigation = useNavigate();

  const handleAction = ()=> {
    navigation('/admin/dashboard/candidates');
  }

  return (
    <div className="w-1/2 flex flex-col gap-5">
      <RecenTitles handleAction={handleAction} title="Recent Applicants" viewAll={true} />
      
      {isLoading ? (
        // Loading state (optional)
        Array(4).fill(0).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} className="h-20 w-full" />
        ))
      ) : (
        // Render actual applicantsျ
         //@ts-expect-error
        recentApplicants?.slice(0, 4).map((applicant) => (
          <RecentApplicant key={applicant.applicant_id} data={applicant} />
        )) ?? null
      )}
    </div>
  );
};

export default RecentApplications;
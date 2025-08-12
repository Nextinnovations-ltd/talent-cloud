import AnalyticalCards from "@/components/common/Admin/AnalyticalCards";
import { JobSeekerCountResponse } from "@/types/admin-auth-slice";


const AnalyticalChartsCardsContainer = ({data,loading}:{data:JobSeekerCountResponse | undefined,loading:boolean}) => {
    return (
        <div className="flex w-full  gap-4">
            <AnalyticalCards title="Total Jobs Posted" loading={loading} count={data?.data?.total_job_posts} />
            <AnalyticalCards title="Applicants" loading={loading} count={data?.data?.job_post_applicants_count} />
        </div>
    )
}

export default AnalyticalChartsCardsContainer;

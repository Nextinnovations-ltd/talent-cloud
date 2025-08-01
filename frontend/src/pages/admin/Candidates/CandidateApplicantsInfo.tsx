import { useParams } from "react-router-dom";
import { useGetOrganizationDetailByAdminQuery } from "@/services/slices/adminSlice";
import { useGetDetailJobApplyCardQuery } from "@/services/slices/jobApplySlice";
import { SkillsSection } from "@/components/common/ApplyJob/SkillsSection";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import AllJobsTabs from "../AllJobs/AllJobsTabs";
import SortsButtons from "../AllJobs/SortsButtons";
import { useEffect } from "react";

const CandidateApplicantsInfo = ({ totalApplicants,sortBy,setSortBy }: { totalApplicants: number,sortBy:string,setSortBy: React.Dispatch<React.SetStateAction<string>>; }) => {

    const { id } = useParams();


    const {
        data,
        isLoading,
        error,
    } = useGetDetailJobApplyCardQuery(id!, { skip: !id });
    const { data: OrgData } = useGetOrganizationDetailByAdminQuery();

   

    useEffect(()=>{
        console.log(sortBy)
    },[sortBy])



    if (!id) {
        return <div>Invalid job ID</div>;
    }

    const jobDetails = data?.data;

   


    if (isLoading) {
        return (
            <div className="mt-10 lg:mt-0 lg:w-[60%] mx-auto rounded sticky top-[190px] h-[100svh] self-start">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return <div>Error loading job details</div>;
    }


    return (
        <div>
            <h3 className="text-[32px] mb-[20px] font-semibold">{jobDetails?.title || ""}</h3>
            <div className="flex items-center mb-[48px] text-[24px] gap-[16px] text-[#575757]">
                <img width={67} height={67} className="rounded-full" src={OrgData?.data?.image_url} />
                <h3>{OrgData?.data?.name}</h3>
            </div>
            <SkillsSection skills={jobDetails?.skills || []} />

            <div className="flex items-center mb-[20px] justify-between">
                <AllJobsTabs myJobTotal={totalApplicants} title="All Applicants" />
                <div className="flex items-center justify-center pr-[24px] gap-4">

                    <SortsButtons
                        title="Applicants"
                        field="applicant_count"
                        currentSort={sortBy}
                        onToggle={setSortBy}
                    />
                    <SortsButtons
                        title="View"
                        field="view_count"
                        currentSort={sortBy}
                        onToggle={setSortBy}
                    />
                    <SortsButtons
                        title="Date"
                        field="created_at"
                        currentSort={sortBy}
                        onToggle={setSortBy}
                    />
                </div>
            </div>
        </div>
    )
}

export default CandidateApplicantsInfo;

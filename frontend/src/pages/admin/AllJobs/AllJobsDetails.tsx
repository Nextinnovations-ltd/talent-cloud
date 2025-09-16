import AboutJob from "@/components/common/ApplyJob/AboutJob";
import { JobInfoGrid } from "@/components/common/ApplyJob/JobInfoGrid";
import { SkillsSection } from "@/components/common/ApplyJob/SkillsSection";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetOrganizationDetailByAdminQuery } from "@/services/slices/adminSlice";
import { useGetDetailJobApplyCardQuery } from "@/services/slices/jobApplySlice";
import { useParams } from 'react-router-dom';
import JobCandidatesInfoHeader from "@/components/common/Admin/JobCandidatesInfoHeader";
import DescriptionsContent from "../CreateNewJob/StepsForms/Components/DescriptionsContent";

const AllJobsDetails = () => {
    const { id } = useParams();

    const {
        data,
        isLoading,
        error,
    } = useGetDetailJobApplyCardQuery(id!, { skip: !id });
    const { data: OrgData } = useGetOrganizationDetailByAdminQuery();

    if (!id) {
        return <div>Invalid job ID</div>;
    }

    const jobDetails = data?.data;

    if (isLoading) {
        return (
            <div className=" flex items-center justify-center mx-auto rounded sticky top-[190px] h-[100svh] self-start">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return <div>Error loading job details</div>;
    }

    return (
        <div className="mt-3">
            <JobCandidatesInfoHeader id={id} side="preview" />
            <ScrollArea className=" px-[70px] relative">
                <h3 className="text-[32px] mb-[20px] font-semibold">{jobDetails?.title || ""}</h3>

                <div className="flex items-center mb-[48px] text-[24px] gap-[16px] text-[#575757]">
                    <img
                        width={67}
                        height={67}
                        className="mb-[14px] rounded-full"
                        src={OrgData?.data?.image_url}
                    />
                    <h3>{OrgData?.data?.name}</h3>
                </div>

                <JobInfoGrid job={jobDetails} />
                <SkillsSection skills={jobDetails?.skills || []} />
                <DescriptionsContent content={jobDetails?.description || ""}/>


                <AboutJob
                    jobTitle={jobDetails?.title || ''}
                    responsibilities={jobDetails?.responsibilities || ''}
                    requirements={jobDetails?.requirements || ''}
                    offer={jobDetails?.offered_benefits || ''}
                />
            </ScrollArea>
        </div>
    )
}

export default AllJobsDetails;
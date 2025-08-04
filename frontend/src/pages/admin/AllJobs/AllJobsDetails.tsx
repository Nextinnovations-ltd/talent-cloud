import AboutJob from "@/components/common/ApplyJob/AboutJob";
import { JobInfoGrid } from "@/components/common/ApplyJob/JobInfoGrid";
import { SkillsSection } from "@/components/common/ApplyJob/SkillsSection";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetOrganizationDetailByAdminQuery } from "@/services/slices/adminSlice";
import { useGetDetailJobApplyCardQuery } from "@/services/slices/jobApplySlice";
import { useParams } from 'react-router-dom';
import JobCandidatesInfoHeader from "@/components/common/Admin/JobCandidatesInfoHeader";
import { useState } from "react";

const AllJobsDetails = () => {

    const { id } = useParams();
    const [isImageLoaded, setIsImageLoaded] = useState(false);

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
        <div className="mt-10">
            {/* <div className="mb-6 flex items-center fixed left-[100px] top-[130px] gap-[48px]"></div> */}
            <JobCandidatesInfoHeader id={id} side="preview" />
            <ScrollArea className="p-[30px] px-[70px] relative">


                <h3 className="text-[32px] mb-[20px] font-semibold">{jobDetails?.title || ""}</h3>

                <div className="flex items-center mb-[48px] text-[24px] gap-[16px] text-[#575757]">
                    {!isImageLoaded && (
                        <div
                            className="mb-[14px] rounded-full bg-gray-200 animate-pulse"
                            style={{ width: 64, height: 64 }}
                        />
                    )}
                    <img
                        width={67}
                        height={67}
                        className="mb-[14px] rounded-full"
                        src={OrgData?.data?.image_url}
                        onLoad={() => setIsImageLoaded(true)}
                        alt="Company Logo"
                    />
                    <h3>{OrgData?.data?.name}</h3>

                </div>

                {/* <CompanyHeader companyLogo={null} companyName={jobDetails?.company?.name || ''} /> */}
                <JobInfoGrid job={jobDetails} />
                <SkillsSection skills={jobDetails?.skills || []} />
                <p className="mt-2">{jobDetails?.description}</p>

                <AboutJob jobTitle={jobDetails?.title || ''} responsibilities={jobDetails?.responsibilities || ''} requirements={jobDetails?.requirements || ''} offer={jobDetails?.offered_benefits || ''} />
            </ScrollArea>
        </div>
    )
}

export default AllJobsDetails;

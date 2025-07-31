import SvgPencil from "@/assets/svgs/SvgPencil";
import SvgTrash from "@/assets/svgs/SvgTrash";
import AboutJob from "@/components/common/ApplyJob/AboutJob";
import { JobInfoGrid } from "@/components/common/ApplyJob/JobInfoGrid";
import { SkillsSection } from "@/components/common/ApplyJob/SkillsSection";
import BackButton from "@/components/common/BackButton";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetOrganizationDetailByAdminQuery } from "@/services/slices/adminSlice";
import { useGetDetailJobApplyCardQuery } from "@/services/slices/jobApplySlice";
import { Users } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import AllJobsAction from "./AllJobsActions";

const AllJobsDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

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
        <div className="mt-10 lg:mt-0 py-[44px]  rounded sticky top-[190px]  self-start">
            {/* <div className="mb-6 flex items-center fixed left-[100px] top-[130px] gap-[48px]"></div> */}
            <div className=" w-full flex justify-between items-center">
                <BackButton handleBack={() => navigate('/admin/dashboard/allJobs')} />
                <nav className="flex items-center gap-5 ">
                  <AllJobsAction onClick={()=>{navigate(`/admin/dashboard/candidates/applicants/${id}`)}} icon={<Users/>} label="View Applicants"/>
                  <AllJobsAction onClick={()=>{}} icon={<SvgPencil/>} label="Edit Job Post"/>
                  <AllJobsAction onClick={()=>{}} icon={<SvgTrash/>} label="Delete Post"/>
                </nav>
            </div>
            <ScrollArea className="p-[30px] px-[70px] relative">


                <h3 className="text-[32px] mb-[20px] font-semibold">{jobDetails?.title || ""}</h3>

                <div className="flex items-center mb-[48px] text-[24px] gap-[16px] text-[#575757]">
                    <img width={67} height={67} className="rounded-full" src={OrgData?.data?.image_url} />
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

import AboutJob from "@/components/common/ApplyJob/AboutJob";
import { JobInfoGrid } from "@/components/common/ApplyJob/JobInfoGrid";
import { SkillsSection } from "@/components/common/ApplyJob/SkillsSection";
import BackButton from "@/components/common/BackButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetOrganizationDetailByAdminQuery } from "@/services/slices/adminSlice";
import { useGetDetailJobApplyCardQuery } from "@/services/slices/jobApplySlice";
import { Users } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';

const AllJobsDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        error,
    } = useGetDetailJobApplyCardQuery(id!, { skip: !id });
    const {data:OrgData} = useGetOrganizationDetailByAdminQuery();


    if (!id) {
        return <div>Invalid job ID</div>;
    }

    const jobDetails = data?.data;

    if (isLoading) {
        return (
            <div className="mt-10 lg:mt-0 lg:w-[60%] mx-auto rounded sticky top-[190px] h-[100svh] self-start">
                <div className="mb-6 flex items-center fixed left-[100px] top-[130px] gap-[48px]">
                    <BackButton handleBack={() => navigate('/')} />
                </div>
                <ScrollArea className="p-[30px] relative">
                    <h3 className="text-[24px] mb-[8px] font-semibold animate-pulse bg-gray-200 rounded w-1/2 h-8" />
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded px-4 py-2 mb-6 animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2.25m0 3.75h.01m-6.938 4.242a9 9 0 1112.856 0A8.963 8.963 0 0112 21a8.963 8.963 0 01-6.928-3.008z" /></svg>
                        <span className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                    <hr className="mb-6" />
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="h-4 bg-gray-200 rounded col-span-1" />
                        <div className="h-4 bg-gray-200 rounded col-span-1" />
                        <div className="h-4 bg-gray-200 rounded col-span-1" />
                        <div className="h-4 bg-gray-200 rounded col-span-1" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="h-20 bg-gray-200 rounded mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                </ScrollArea>
            </div>
        );
    }

    if (error) {
        return <div>Error loading job details</div>;
    }


    return (
        <div className="mt-10 lg:mt-0  border-2  rounded sticky top-[190px]  self-start">
            {/* <div className="mb-6 flex items-center fixed left-[100px] top-[130px] gap-[48px]"></div> */}
            <div className="border-2 w-full flex justify-between items-center">
            <BackButton handleBack={() => navigate('/')} />
             <nav className="flex items-center ">
                <div className="flex items-center justify-center gap-[24px]">
                    <div className="bg-[#F0F9FF] w-[48px] h-[48px] rounded-full flex items-center justify-center">
                        <Users/>
                    </div>
                    <h3>View Applicants </h3>
                </div>
             </nav>
            </div>
            <ScrollArea className="p-[30px] px-[70px] relative">


            <h3 className="text-[32px] mb-[20px] font-semibold">{jobDetails?.title || ""}</h3>

            <div className="flex items-center mb-[48px] text-[24px] gap-[16px] text-[#575757]">
                <img width={67} height={67} className="rounded-full" src={OrgData?.data?.image_url}/>
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

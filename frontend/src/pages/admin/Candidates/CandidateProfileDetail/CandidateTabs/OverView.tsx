/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReactNode } from "react";
import OverViewSummary from "./OverViewSummary";
import { useLocation, useParams } from "react-router-dom";
import { useGetJobSeekersOverViewQuery } from "@/services/slices/adminSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import OverViewApplication from "./OverViewApplication";
import OverViewOtherApplied from "./OverViewOtherApplied";



const OverView = () => {

    const { id } = useParams<{ id: string }>();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const application_id = queryParams.get('application_id');

    const { data } = useGetJobSeekersOverViewQuery(
        id && application_id ? { id: id, applicationId: application_id } : skipToken
    );

    const ProfileData = data?.data;

    console.log(ProfileData)




    return (
        <div className="space-y-[50px]">
            <Frame title="Profile Summary" children={
                <div className="grid grid-cols-3  gap-[32px]">
                    <OverViewSummary
                        experienceLevel={ProfileData?.occupation.experience_level || '-'}
                        experienceYears={ProfileData?.occupation.experience_years || 0}
                        specializationName={ProfileData?.occupation.specialization_name || '-'}
                        expectedSalary={ProfileData?.expected_salary || '$ ----'}
                        age={ProfileData?.age || 0}
                        role={ProfileData?.occupation?.role_name || '-'}
                    />
                </div>
            } />
            <Frame title="Latest Applied Job" children={
                <div className="grid grid-cols-3  gap-[52px]">
                    <OverViewApplication
                        positionApplied={ProfileData?.recent_application?.position || '-'}
                        company={ProfileData?.recent_application?.company || '-'}
                        //@ts-expect-error
                        offeredSalary={ProfileData?.recent_application?.salary || '-'}
                        appliedDate={ProfileData?.recent_application?.applied_date || '-'}
                        endDate={ProfileData?.recent_application?.last_application_date || '-'}
                        //@ts-expect-error
                        totalApplicant={ProfileData?.recent_application?.total_applicants || ''}
                    />
                </div>
            } />

            <div className=" rounded-xl mt-[72px] w-full py-[35px] px-[40px] ">
                <h3 className="text-[24px] font-semibold mb-[32px]">Other Applied Jobs </h3>
                <OverViewOtherApplied 
                    otherAppliedData={ProfileData?.recent_applied_jobs?.map(job => ({
                        ...job,
                        applicant_count: job.applicant_count.toString(),
                        salary: job.salary.toString(),
                    })) || []} 
                />
            </div>

        </div>
    )
}


const Frame = ({ title, children }: { title: string, children: ReactNode }) => {
    return (
        <div className="border border-[#CBD5E1] rounded-xl mt-[72px] w-full py-[35px] px-[40px] ">
            <h3 className="text-[24px] font-semibold mb-[32px]">{title}</h3>
            {children}
        </div>
    )
}

export default OverView;
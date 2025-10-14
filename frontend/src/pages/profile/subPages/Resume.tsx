import { ProfileTitle } from "@/components/common/ProfileTitle";
import { useGetJobSeekerResumeListQuery } from "@/services/slices/adminSlice";
import ApplyJobUploadResume from "@/components/jobApply/ApplyJobUploadResume";
import ResumeItem from "@/pages/jobSeekerresume/ResumeItem";

const Resume = () => {

    const { data, isLoading } = useGetJobSeekerResumeListQuery();
    const LISTDATA = data?.data;

    return (
        <div className="mb-[120px]">
            <ProfileTitle title="Resume" />
            <div className="mt-[52px]">
                <ApplyJobUploadResume disabled={LISTDATA?.length === 3} bigSize type={"defaultResume"} />
                <div className="mt-[52px]">
                    <h3 className="text-[32px] font-medium">Manage Your Resume</h3>
                    <p className="text-[#575757] mt-[11px]">You can keep a maximum of 3 resumes in your profile.</p>

                    <div className="flex flex-col gap-[37px] mt-[50px]">
                        {!isLoading ? (
                            LISTDATA?.map((item, index) => (
                                <ResumeItem item={item} key={index} />
                            ))
                        ) : (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="w-[667px] h-[120px] flex items-start justify-between gap-4 rounded-[12px] border border-[#CBD5E1] p-[15px] animate-pulse"
                                >
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="h-5 w-1/3 bg-gray-100 rounded"></div>
                                        <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                                        <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                            ))
                        )}


                    </div>

                </div>
            </div>
        </div>
    )
}


export default Resume;

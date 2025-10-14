import BackButton from "@/components/common/BackButton";
import ApplyJobUploadResume from "@/components/jobApply/ApplyJobUploadResume";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import ResumeItem from "./ResumeItem";
import { useGetJobSeekerResumeListQuery } from "@/services/slices/adminSlice";


const JobSeekerResume = () => {

  const { data, isLoading } = useGetJobSeekerResumeListQuery();
  const isError = false;

  const LISTDATA = data?.data;



  const navigate = useNavigate();

  if (isError) {
    return (
      <div className="container mx-auto py-[50px] flex justify-center items-center">
        <span className="text-red-500">Failed to load resume.</span>
      </div>
    );
  }


  return (
    <div className="container  mx-auto 2xl:px-[100px]  py-[50px] pb-[150px] ">
      <div className={clsx('flex items-center  gap-[48px]')}>
        <BackButton handleBack={() => navigate(-1)} /><h3 className="text-[40px] font-semibold">Upload Resume</h3>
      </div>
      <div className=" px-[100px] mt-[82px]">
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


export default JobSeekerResume;
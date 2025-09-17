import BackButton from "@/components/common/BackButton";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import ApplyJobUploadResume from "@/components/jobApply/ApplyJobUploadResume";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import ResumeItem from "./ResumeItem";


const JobSeekerResume = () => {

  const isError = false;
  const isLoading = false;
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto  h-[80svh] py-[50px] flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-[50px] flex justify-center items-center">
        <span className="text-red-500">Failed to load resume.</span>
      </div>
    );
  }


  return (
    <div className="container  mx-auto 2xl:px-[100px]  py-[50px] ">
      <div className={clsx('flex items-center  gap-[48px]')}>
        <BackButton handleBack={() => navigate(-1)} /><h3 className="text-[40px] font-semibold">Upload Resume</h3>
      </div>
      <div className=" px-[100px] mt-[82px]">
        <ApplyJobUploadResume type={"profile"} />
        <div className="mt-[52px]">
          <h3 className="text-[32px] font-medium">Manage Your Resume</h3>
          <p className="text-[#575757] mt-[11px]">You can keep a maximum of 3 resumes in your profile.</p>

          <div className="flex flex-col gap-[37px] mt-[50px]">
            <ResumeItem />
            <ResumeItem />

          </div>

        </div>
      </div>
    </div>
  )
}


export default JobSeekerResume;
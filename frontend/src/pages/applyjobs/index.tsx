/* eslint-disable @typescript-eslint/ban-ts-comment */
import { JobInfoGrid } from "@/components/common/ApplyJob/JobInfoGrid"
import { SkillsSection } from "@/components/common/ApplyJob/SkillsSection"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import ApplyCoverLetter from "@/components/jobApply/ApplyCoverletter"
import ApplyJobResume from "@/components/jobApply/ApplyJobResume"
import { Button } from "@/components/ui/button"
import useToast from "@/hooks/use-toast"
import uploadToS3 from "@/lib/UploadToS3/UploadToS3"
import { useApplyJobMutation, useGetDetailJobApplyCardQuery } from "@/services/slices/jobApplySlice"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useGetJobSeekerResumeQuery } from "@/services/slices/jobSeekerSlice";
import { useNavigate } from "react-router-dom";




const ApplyJob = () => {


  const { id } = useParams<{ id: string }>();
  const numericJobId = Number(id);
  // in ApplyJob.tsx
  const [fileData, setFileData] = useState<File>();
  const [radioValue, setRadioValue] = useState<"uploadCover" | "noCover">("noCover");
  const [radioResumeValue, setResumeRadioValue] = useState<"upload" | "choose">("choose");

  const [coverError, setCoverError] = useState(false);
  const [resumeUploadId, setResumeUploadId] = useState<string | undefined>(undefined);
  const navigation = useNavigate();



  const [loading, setLoading] = useState(false);
  const [applyJob, { isLoading: JOBBOOKLOADING }] = useApplyJobMutation();
  const {
    data: JOBDETAILDATA,
  } = useGetDetailJobApplyCardQuery(numericJobId);

  const { data } = useGetJobSeekerResumeQuery();


  const { showNotification } = useToast();
  const jobDetails = JOBDETAILDATA?.data;

  console.log("hello")

  const handleApply = async () => {
    if (!numericJobId || isNaN(numericJobId)) {
      showNotification({ message: "Invalid job ID in URL.", type: "danger" });
      return;
    }


    if (radioValue === "uploadCover" && !fileData) {
      setCoverError(true);
      return;
    }



    try {
      setLoading(true);

      const payload = {
        cover_letter_upload_id: "",
        is_skipped: false,
        resume_upload_id: ""
      };

      if (resumeUploadId) {
        payload.resume_upload_id = resumeUploadId
      }

      if (fileData) {
        const result = await uploadToS3({
          file: fileData!,
          type: "coverLetter",
          postId: id!,
        });
        //@ts-ignore
        payload.cover_letter_upload_id = result;


      } else {
        payload.is_skipped = true;
      }

      await applyJob({
        jobId: numericJobId,
        credentials: payload,
      }).unwrap();

      // showNotification({
      //   //@ts-ignore
      //   message: response?.message,
      //   type: "success",
      // });

      navigation('/admin/dashboard/allJobs');

      setLoading(false);
    } catch (error: unknown) {
      showNotification({
        message:
          error && typeof error === "object" && "data" in error && error.data
            ? (error.data as { message?: string }).message
            : "Application failed",
        type: "danger",
      });
      setLoading(false);
    }
  };

  return (
    <div className="container  mx-auto  pb-[200px] pt-[20px]">
      <Link to={`/?jobId=${id}`}>
        <button className="border-[1px] ml-[50px] fixed  cursor-pointer w-[62px] h-[62px] flex duration-700 hover:border-blue-300 hover:bg-slate-100 items-center justify-center rounded-full">
          <ChevronLeft />
        </button>
      </Link>
      <div className="max-w-[600px]   pb-[50px] pt-[50px]  ml-[25%]">
        <h3 className="text-[24px] mb-[24px] font-semibold">{jobDetails?.title}</h3>
        <JobInfoGrid job={jobDetails} />
        <SkillsSection skills={jobDetails?.skills || []} />
        <Link to={`/?jobId=${jobDetails?.id}`}>
          <h3 className=" underline text-[#0481EF] text-[18px]">View Full Job Description </h3>
        </Link>

        <ApplyJobResume
          setRadioValue={setResumeRadioValue}
          radioValue={radioResumeValue}
          setResumeUploadId={setResumeUploadId}
          resumeData={data?.data?.resume_url} />

        <ApplyCoverLetter
          fileData={fileData}
          setFileData={setFileData}
          radioValue={radioValue}
          setRadioValue={setRadioValue}
          coverError={coverError}
        />

        <Button onClick={handleApply} disabled={radioResumeValue === "upload" && !resumeUploadId} className="mt-[30px] w-[150px] text-white disabled:cursor-none border border-slate-300 bg-[#0481EF] ">{
          JOBBOOKLOADING || loading ? <LoadingSpinner /> : 'Submit'}</Button>

      </div>
    </div>
  )
}

export default ApplyJob
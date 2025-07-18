import { JobInfoGrid } from "@/components/common/ApplyJob/JobInfoGrid"
import { SkillsSection } from "@/components/common/ApplyJob/SkillsSection"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import ApplyCoverLetter from "@/components/jobApply/ApplyCoverletter"
import ApplyJobResume from "@/components/jobApply/ApplyJobResume"
import { Button } from "@/components/ui/button"
import useToast from "@/hooks/use-toast"
import { useApplyJobMutation, useGetDetailJobApplyCardQuery } from "@/services/slices/jobApplySlice"
import { ChevronLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"



 
 const ApplyJob = () => {


    const { id } = useParams<{ id: string }>();
    const numericJobId = Number(id);
    const [applyJob,{ isLoading:JOBBOOKLOADING}] = useApplyJobMutation();
    const {
        data:JOBDETAILDATA,
      } = useGetDetailJobApplyCardQuery(numericJobId);

      
    
    const { showNotification } = useToast();
    const jobDetails = JOBDETAILDATA?.data;





    const handleApply = async()=>{
        if (!numericJobId || isNaN(numericJobId)) {
            showNotification({
                message: "Invalid job ID in URL.",
                type: "danger",
            });
            return;
        }
        try {
            const payload = {
                "cover_letter": "Cover Test",
                "application_resume_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            };


            const response = await applyJob({
                jobId: numericJobId,
                credentials: payload
            }).unwrap();



            showNotification({
              message: response?.message,
              type: "success",
            });
          } catch (error: unknown) {
            showNotification({
              message: (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) ? (error.data as { message?: string }).message : "Application failed",
              type: "danger",
            });
          }
    }

  return (
    <div className="container  mx-auto  pt-[20px]">
        <Link to={'/'}>
        <button className="border-[1px] ml-[50px] fixed  cursor-pointer w-[62px] h-[62px] flex duration-700 hover:border-blue-300 hover:bg-slate-100 items-center justify-center rounded-full">
            <ChevronLeft/>
        </button>
        </Link>
        <div className="max-w-[600px]   pb-[50px] pt-[50px]  ml-[25%]">
        <h3 className="text-[24px] mb-[24px] font-semibold">{jobDetails?.title }</h3>
         <JobInfoGrid job={jobDetails} /> 
        <SkillsSection skills={jobDetails?.skills || []} />
      <Link to={`/?jobId=${jobDetails.id}`}>
        <h3 className=" underline text-[#0481EF] text-[18px]">View Full Job Description </h3>
        </Link>

        <ApplyJobResume/>
        <ApplyCoverLetter/>
        <Button onClick={handleApply} className="mt-[30px] w-[150px] text-white border border-slate-300 bg-[#0481EF]">{
            JOBBOOKLOADING ? <LoadingSpinner/>: 'Submit Application'}</Button>

        </div>
    </div>
  )
}

export default ApplyJob
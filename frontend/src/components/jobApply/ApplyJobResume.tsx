
import { useState } from "react";
import { Label } from "../ui/label";
import { RadioGroupItem, RadioGroup } from "../ui/radio-group";
import ApplyJobUploadResume from "./ApplyJobUploadResume";
// import ApplyJobResumeItemContainer from "./ApplyJobResumeItemContainer";


type ApplyJobResumeProps = {
  resumeData: string | undefined,
  setResumeUploadId :  (id:string | undefined)=> void ,
}

const ApplyJobResume: React.FC<ApplyJobResumeProps> = ({ resumeData,setResumeUploadId }) => {


  const [radioValue, setRadioValue] = useState("upload");





  return (
    <div className="mt-[20px]">
      <h3 className="text-[22px]">Resume</h3>
      <p className="text-[14px] my-[10px]">Choose how you'd like to submit your resume</p>
      <RadioGroup onValueChange={(e) => setRadioValue(e)} className="mt-[40px]" defaultValue={resumeData ? 'choose' : 'upload'}>
        <div className="flex items-center cursor-pointer gap-3">
          <RadioGroupItem value="upload" id="r1" />
          <Label className="font-medium cursor-pointer" htmlFor="r1">
            <h3 className="text-[16px]">Upload New Resume</h3>
            <p className="text-[12px] mt-[10px] font-light">Upload a resume</p>
          </Label>
        </div>
        {
          radioValue === "upload" &&
          <div className="mt-[20px]">
            <ApplyJobUploadResume  setResumeUploadId={setResumeUploadId} type="resume" />
          </div>
        }
        {/* <div className="flex items-center cursor-pointer gap-3 mt-[40px]">
          <RadioGroupItem value="choose" id="r2" />
          <Label className="font-medium cursor-pointer" htmlFor="r2">
            <h3 className="text-[16px]">Use Previous Resume</h3>
            <p className="text-[12px] mt-[10px] font-light">Select from your uploaded resumes</p>
          </Label>
        </div> */}
      </RadioGroup>
      {/* <div className="ml-8">
        <ApplyJobResumeItemContainer />
      </div> */}
    </div>
  )
}

export default ApplyJobResume;

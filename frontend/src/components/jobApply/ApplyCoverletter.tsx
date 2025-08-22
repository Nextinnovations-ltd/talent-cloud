import { useState } from "react";
import { Label } from "../ui/label";
import { RadioGroupItem,RadioGroup } from "../ui/radio-group";
import ApplyJobUploadResume from "./ApplyJobUploadResume";


const ApplyCoverLetter = () => {

  const [radioVaue, setRadioValue] = useState("noCover");

  return (
    <div className="mt-[50px] mb-[10px]">
        <h3 className="text-[22px]">Cover Letter</h3>
        <p className="text-[14px] my-[10px]">Optional but recommended to stand out</p>
        <RadioGroup onValueChange={(e)=>setRadioValue(e)}  className="mt-[40px]" defaultValue="noCover">
      <div className="flex items-center cursor-pointer gap-3">
        <RadioGroupItem  value="uploadCover" id="c1" />
        <Label className="font-medium cursor-pointer" htmlFor="c1">
            <h3 className="text-[16px]">Upload Cover Letter</h3>
            <p className="text-[12px] mt-[10px] font-light">Upload a personalized cover letter</p>
        </Label>
      </div>
      {
        radioVaue === "uploadCover" &&<div className="mt-[20px]">
        <ApplyJobUploadResume type="coverLetter"/>
       </div>
      }
      <div className="flex items-center cursor-pointer gap-3 mt-[40px]">
        <RadioGroupItem value="noCover" id="c2" />
        <Label className="font-medium cursor-pointer" htmlFor="c2">
            <h3 className="text-[16px]">Skip Cover Letter</h3>
            <p className="text-[12px] mt-[10px] font-light">Continue without a cover letter</p>
        </Label>
      </div>
    </RadioGroup>
    </div>
  )
}

export default ApplyCoverLetter;

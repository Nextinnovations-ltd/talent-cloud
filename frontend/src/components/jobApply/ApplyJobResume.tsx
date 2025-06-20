import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroupItem,RadioGroup } from "../ui/radio-group";


const ApplyJobResume = () => {
  return (
    <div className="mt-[20px]">
        <h3 className="text-[22px]">Resume</h3>
        <p className="text-[14px] my-[10px]">Choose how you'd like to submit your resume</p>
        <RadioGroup className="mt-[40px]" defaultValue="comfortable">
      <div className="flex items-center opacity-50  cursor-pointer gap-3">
        <RadioGroupItem disabled value="default" id="r1" />
        <Label className="font-medium cursor-pointer" htmlFor="r1">
            <h3 className="text-[16px]">Upload New Resume</h3>
            <p className="text-[12px] mt-[10px] font-light">Upload a personalized cover letter</p>
        </Label>
      </div>
      <div className="flex items-center cursor-pointer gap-3 mt-[40px]">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label className="font-medium cursor-pointer" htmlFor="r2">
            <h3 className="text-[16px]">Use Previous Resume</h3>
            <p className="text-[12px] mt-[10px] font-light">Select from your uploaded resumes</p>
        </Label>
      </div>
    </RadioGroup>
   <div className="flex mt-[30px] gap-[20px] items-center ">
   <Button className="border border-slate-300 bg-[#E6F3FF]">dummy.pdf</Button>
   <Button  className="w-[38px] border border-slate-300 hover:scale-105 duration-300 h-[38px] rounded-full bg-[#E6F3FF] p-0" onClick={() => window.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank") }><Eye size={18}/></Button>
   </div>
    </div>
  )
}

export default ApplyJobResume;

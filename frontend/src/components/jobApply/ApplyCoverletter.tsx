
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroupItem,RadioGroup } from "../ui/radio-group";


const ApplyCoverLetter = () => {
  return (
    <div className="mt-[50px] mb-[60px]">
        <h3 className="text-[22px]">Cover Letter</h3>
        <p className="text-[14px] my-[10px]">Optional but recommended to stand out</p>
        <RadioGroup className="mt-[40px]" defaultValue="comfortable">
      <div className="flex items-center cursor-pointer gap-3">
        <RadioGroupItem value="default" id="c1" />
        <Label className="font-medium cursor-pointer" htmlFor="c1">
            <h3 className="text-[16px]">Upload Cover Letter</h3>
            <p className="text-[12px] mt-[10px] font-light">Upload a personalized cover letter</p>
        </Label>
      </div>
      <div className="flex items-center cursor-pointer gap-3 mt-[40px]">
        <RadioGroupItem value="comfortable" id="c2" />
        <Label className="font-medium cursor-pointer" htmlFor="c2">
            <h3 className="text-[16px]">Skip Cover Letter</h3>
            <p className="text-[12px] mt-[10px] font-light">Continue without a cover letter</p>
        </Label>
      </div>
    </RadioGroup>
    <Button className="mt-[30px] text-white border border-slate-300 bg-[#0481EF]">Submit Application</Button>
    </div>
  )
}

export default ApplyCoverLetter;

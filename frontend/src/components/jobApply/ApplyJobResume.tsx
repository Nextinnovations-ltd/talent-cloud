import { Label } from "../ui/label";
import { RadioGroupItem, RadioGroup } from "../ui/radio-group";
import ApplyJobUploadResume from "./ApplyJobUploadResume";
import ApplyJobResumeItemContainer from "./ApplyJobResumeItemContainer";

type ApplyJobResumeProps = {
  resumeData: string | undefined,
  setResumeUploadId: (id: string | undefined) => void,
  radioValue: "upload" | "choose";
  setRadioValue: (value: "upload" | "choose") => void;
}

const ApplyJobResume: React.FC<ApplyJobResumeProps> = ({ setResumeUploadId, setRadioValue, radioValue }) => {

  const handleRadioChange = (value: "upload" | "choose") => {
    setRadioValue(value);

    // Null the uploaded resume ID if "choose" is selected
    if (value === "choose") {
      setResumeUploadId(undefined);
    }
  };

  return (
    <div className="mt-[20px]">
      <h3 className="text-[22px]">Resume</h3>
      <p className="text-[14px] my-[10px]">Choose how you'd like to submit your resume</p>
      
      <RadioGroup 
        onValueChange={(e) => handleRadioChange(e as "upload" | "choose")} 
        className="mt-[40px]" 
        defaultValue={radioValue}
      >
        <div className="flex items-center cursor-pointer gap-3">
          <RadioGroupItem value="upload" id="r1" />
          <Label className="font-medium cursor-pointer" htmlFor="r1">
            <h3 className="text-[16px]">Upload New Resume</h3>
          </Label>
        </div>

        {radioValue === "upload" && (
          <div className="mt-[20px]">
            <ApplyJobUploadResume setResumeUploadId={setResumeUploadId} type="resume" />
          </div>
        )}

        <div className="flex items-center cursor-pointer gap-3 mt-[40px]">
          <RadioGroupItem value="choose" id="r2" />
          <Label className="font-medium cursor-pointer" htmlFor="r2">
            <h3 className="text-[16px]">Use Default Resume</h3>
            <p className="text-[12px] mt-[10px] font-light">Select your default uploaded resumes</p>
          </Label>
        </div>
      </RadioGroup>

      {radioValue === "choose" && (
        <div className="ml-8">
          <ApplyJobResumeItemContainer />
        </div>
      )}
    </div>
  )
}

export default ApplyJobResume;
